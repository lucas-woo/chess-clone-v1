import { Router } from "express";
import { getPuzzles,saveProgress, getAllLeaderboard, getDailyLeaderboard, getDailyRank } from "../handlers/puzzle-routes.ts";
import { protectedroute } from "../middleware/auth-validators.ts";
const router = Router()

router.get("/", getPuzzles) 

//VALIDATION

router.put("/update", protectedroute, saveProgress)

router.get("/leaderboard/all", getAllLeaderboard)

router.get("/leaderboard/daily", getDailyLeaderboard)

router.get("/rank", protectedroute, getDailyRank)


export default router