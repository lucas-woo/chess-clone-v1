import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import { UsersModel } from "./models/Users.ts";
import { UserLeaderboard } from "../types/types.ts";

export const redisClient = createClient();

export const ALL_LEADERBOARD_KEY = process.env.ALL_LEADERBOARD_KEY || "all_leaderboard"

export const DAILY_LEADERBOARD_KEY = process.env.DAILY_LEADERBOARD_KEY || "daily_leaderboard"

export const DAILY_RANK_KEY = process.env.DAILY_RANK_KEY || "daily_rank"

export const SESSION_STORE_PREFIX = process.env.SESSION_STORE_PREFIX || "ChatAppStore:"

export const connectRedis = async (): Promise<RedisStore | boolean> => {
  try{
    await redisClient.connect()
    const store = new RedisStore({
      client: redisClient,
      prefix: SESSION_STORE_PREFIX
    })
    console.log("Redis connected")

    await redisClient.del(ALL_LEADERBOARD_KEY)
    
    const leaderboard = await UsersModel.find({}).sort({ highScore: -1 }).limit(50)
    
    for (let i = 0; i < leaderboard.length; i++) {
      if(leaderboard[i].highScore === 0 || !leaderboard[i].username) continue;
      const player: UserLeaderboard = {
        username: leaderboard[i].username,
        profilePicture: leaderboard[i].profilePicture,
      }

      await redisClient.zAdd(ALL_LEADERBOARD_KEY, {
        score: leaderboard[i].highScore,
        value: JSON.stringify(player)
      })
    }

    return store
  } catch (e) {
    console.error("Error connecting to Redis Client")
    return false
  }
}