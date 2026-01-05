import type { Request, Response, NextFunction } from "express-serve-static-core";
import { PuzzleModel } from "../database/models/Puzzles.ts";
import { redisClient, ALL_LEADERBOARD_KEY, DAILY_LEADERBOARD_KEY, DAILY_RANK_KEY } from "../database/connect-redis.ts";
import { UsersModel } from "../database/models/Users.ts";
import { UserLeaderboard } from "../types/types.ts";


export const getPuzzles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { level } = req.query;
    const lvl = Number(level)
    // level 1 is first 5 puzzles
    const puzzleLevels = await PuzzleModel.aggregate([
    { $match: { level: lvl } },
    { $sample: { size: 5 } },  
    { $project: { __v: 0, _id: 0 } }
  ]);
    res.send(puzzleLevels)
  } catch (e) {
    console.error("error retrieving puzzles")
    next(e)
  }
}

export const saveProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.user.username) return res.sendStatus(401)
    
    //needa validate score
    const { score } = req.body
    let updatedScore: boolean = false
    if (req.user.highScore < score) {
      updatedScore = true
      const updated = await UsersModel.findByIdAndUpdate(req.user.id, {highScore: score}, {new: true})
      if (!updated) throw new Error();
    }

    const player: UserLeaderboard = {
      username: req.user.username,
      profilePicture: req.user.profilePicture,
    }

    //
    // update daily rank
    //
    const currentDailyScore = await redisClient.zScore(DAILY_RANK_KEY, req.user.username);
    if (!currentDailyScore || (currentDailyScore && currentDailyScore < score)) {
       await redisClient.zAdd(DAILY_RANK_KEY, { value: req.user.username, score: score });
    }

    //
    // update daily leaderboard
    //
    const daily = await redisClient.zRangeWithScores(DAILY_LEADERBOARD_KEY, -50, -50) 
    if (!daily.length || daily[0].score <= score) {

      const leaderboard = await redisClient.zRangeWithScores(DAILY_LEADERBOARD_KEY, -50, -1)
      let exist: boolean = false;
      let changed = false
      for (let i = 0; i < leaderboard.length; i++) {
        let cur: UserLeaderboard = JSON.parse(leaderboard[i].value);
        if (cur.username !== req.user.username) continue;

        exist = true;

        if (leaderboard[i].score >= score) break
        await redisClient.zRem(DAILY_LEADERBOARD_KEY, leaderboard[i].value)
        await redisClient.zAdd(DAILY_LEADERBOARD_KEY, {
          score,
          value: JSON.stringify(player)
        })

        changed = true
        break;
      }
      if (!changed && !exist) {
        
        await redisClient.zAdd(DAILY_LEADERBOARD_KEY, {
          score,
          value: JSON.stringify(player)
        })
        let last = await redisClient.zRange(DAILY_LEADERBOARD_KEY, -51, -51)
        if(leaderboard.length > 50) await redisClient.zRem(DAILY_LEADERBOARD_KEY,last)
      }
    }
    //
    // update all leaderboard
    //
    const all = await redisClient.zRangeWithScores(ALL_LEADERBOARD_KEY, -50, -50)
    if (!all.length || all[0].score <= score) {
      let exist: boolean = false
      const leaderboard = await redisClient.zRangeWithScores(ALL_LEADERBOARD_KEY, -50, -1)
      let changed = false
      for (let i = 0; i < leaderboard.length; i++) {
        let cur: UserLeaderboard = JSON.parse(leaderboard[i].value);
        if (cur.username !== req.user.username) continue;

        exist = true;

        if (leaderboard[i].score >= score) break

        await redisClient.zRem(ALL_LEADERBOARD_KEY, leaderboard[i].value)
        await redisClient.zAdd(ALL_LEADERBOARD_KEY, {
          score,
          value: JSON.stringify(player)
        })
        
        changed = true

        break;
        
      }
      if (!changed && !exist) {
        
        await redisClient.zAdd(ALL_LEADERBOARD_KEY, {
          score,
          value: JSON.stringify(player)
        })
        if(leaderboard.length > 50){
          let last = await redisClient.zRange(ALL_LEADERBOARD_KEY, -51, -51)
          await redisClient.zRem(ALL_LEADERBOARD_KEY,last)
        }
      }
    }

    return res.send({
      err: false,
      updated: updatedScore
    })

  } catch (e) {
    console.error("error saving score")
    next(e)
  }
}

export const getAllLeaderboard =  async (req: Request, res: Response, next: NextFunction) => {
  try {
    //ascending order
    const leaderboard = await redisClient.zRangeWithScores(ALL_LEADERBOARD_KEY, -50, -1)
    res.send(leaderboard)
  } catch (e) {
    console.error("error with getting leaderboard")
    next(e)
  }
}

export const getDailyLeaderboard =  async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leaderboard = await redisClient.zRangeWithScores(DAILY_LEADERBOARD_KEY, -50, -1)
    res.send(leaderboard)
  } catch (e) {
    console.error("error with getting leaderboard")
    next(e)
  }
}

export const getDailyRank = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!req.user) throw new Error();
    const rank = await redisClient.zRevRank(DAILY_RANK_KEY, req.user.username)
    const dailyHighScore = await redisClient.zScore(DAILY_RANK_KEY, req.user.username);
    
    if(rank === null){
      return res.send({
        rank: null,
        dailyHighScore: null,
        err: true
      })
    } else {      
      return res.send({
      dailyHighScore: dailyHighScore,
      rank: rank+1,
      err: false
    })
    }
  } catch(e){
    console.error("error in daily rank")
    next(e)
  }
}