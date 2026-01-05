var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import { UsersModel } from "./models/Users.js";
export const redisClient = createClient();
export const ALL_LEADERBOARD_KEY = process.env.ALL_LEADERBOARD_KEY || "all_leaderboard";
export const DAILY_LEADERBOARD_KEY = process.env.DAILY_LEADERBOARD_KEY || "daily_leaderboard";
export const DAILY_RANK_KEY = process.env.DAILY_RANK_KEY || "daily_rank";
export const SESSION_STORE_PREFIX = process.env.SESSION_STORE_PREFIX || "ChatAppStore:";
export const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redisClient.connect();
        const store = new RedisStore({
            client: redisClient,
            prefix: SESSION_STORE_PREFIX
        });
        console.log("Redis connected");
        yield redisClient.del(ALL_LEADERBOARD_KEY);
        const leaderboard = yield UsersModel.find({}).sort({ highScore: -1 }).limit(50);
        for (let i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].highScore === 0 || !leaderboard[i].username)
                continue;
            const player = {
                username: leaderboard[i].username,
                profilePicture: leaderboard[i].profilePicture,
            };
            yield redisClient.zAdd(ALL_LEADERBOARD_KEY, {
                score: leaderboard[i].highScore,
                value: JSON.stringify(player)
            });
        }
        return store;
    }
    catch (e) {
        console.error("Error connecting to Redis Client");
        return false;
    }
});
