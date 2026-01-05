import { ALL_LEADERBOARD_KEY, DAILY_LEADERBOARD_KEY, DAILY_RANK_KEY, redisClient } from "../database/connect-redis.ts";
import type { UserLeaderboard } from "../types/types.ts";

export const findAndUpdateUsername = async (oldUsername: string, updatedUsername: string) => {
  
  //daily rank
  const currentDailyScore = await redisClient.zScore(DAILY_RANK_KEY, oldUsername);
  
  if(currentDailyScore){
    
    await redisClient.zRem(DAILY_RANK_KEY, oldUsername)
    await redisClient.zAdd(DAILY_RANK_KEY, {
      value: updatedUsername,
      score: currentDailyScore
    })
    
  }
  //daily score
  
  const daily = await redisClient.zRangeWithScores(DAILY_LEADERBOARD_KEY, -50, -1)
  
  if(daily.length){
    
    for (let i = 0; i < daily.length; i++){
      const cur = daily[i]
      const data: UserLeaderboard = JSON.parse(cur.value)
      if(data.username !== oldUsername) continue;
      
      await redisClient.zRem(DAILY_LEADERBOARD_KEY, cur.value)
      const newData: UserLeaderboard = {
        profilePicture: data.profilePicture,
        username: updatedUsername
      };
      await redisClient.zAdd(DAILY_LEADERBOARD_KEY, {
        value: JSON.stringify(newData),
        score: cur.score
      })
      break;
    }
  } 

  //all
  const all = await redisClient.zRangeWithScores(ALL_LEADERBOARD_KEY, -50, -1)
  
  if(all.length){
    
    for (let i = 0; i < all.length; i++){
      const cur = all[i]
      const data:UserLeaderboard = JSON.parse(cur.value)
      if(data.username !== oldUsername) continue;
      
      await redisClient.zRem(ALL_LEADERBOARD_KEY, cur.value)
      const newData: UserLeaderboard = {
        profilePicture: data.profilePicture,
        username: updatedUsername
      };
      await redisClient.zAdd(ALL_LEADERBOARD_KEY, {
        value: JSON.stringify(newData),
        score: cur.score
      })
      
      break;
    }
  } 
}

export const findAndUpdateProfilePicture = async(username: string, newURL: string) => {

  //daily
  const daily = await redisClient.zRangeWithScores(DAILY_LEADERBOARD_KEY, -50, -1)
  
  if(daily.length){
    
    for (let i = 0; i < daily.length; i++){
      const cur = daily[i]
      const data: UserLeaderboard = JSON.parse(cur.value)
      if(data.username !== username) continue;
      
      await redisClient.zRem(DAILY_LEADERBOARD_KEY, cur.value)
      const newData: UserLeaderboard = {
        profilePicture: newURL,
        username: username
      };
      await redisClient.zAdd(DAILY_LEADERBOARD_KEY, {
        value: JSON.stringify(newData),
        score: cur.score
      })
      break;
    }
  } 
  

  //all
  const all = await redisClient.zRangeWithScores(ALL_LEADERBOARD_KEY, -50, -1)
  
  if(all.length){
    
    for (let i = 0; i < all.length; i++){
      const cur = all[i]
      const data:UserLeaderboard = JSON.parse(cur.value)
      if(data.username !== username) continue;
      
      await redisClient.zRem(ALL_LEADERBOARD_KEY, cur.value)
      const newData: UserLeaderboard = {
        profilePicture: newURL,
        username: username
      };
      await redisClient.zAdd(ALL_LEADERBOARD_KEY, {
        value: JSON.stringify(newData),
        score: cur.score
      })
      
      break;
    }
  } 
}