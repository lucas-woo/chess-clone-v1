import { create } from "zustand"
import { serverAPI } from "../utils/connect-axios"
import type { UserLeaderboardDisplay } from "../types"
import { convertLeaderboard } from "../utils/leaderboard"

interface LeaderboardStore {
  allLeaderboard: UserLeaderboardDisplay[],
  dailyLeaderboard: UserLeaderboardDisplay[],
  getDailyLeaderboard: () => void,
  getAllLeaderboard: () => void,
}

export const useLeaderboardStore = create<LeaderboardStore>((set) => {
  return {
    dailyLeaderboard: [],
    allLeaderboard: [],
    getDailyLeaderboard: async () => {
      try {
        const res = await serverAPI.get("/puzzles/leaderboard/daily")
        if(!res.data) throw new Error();
        set({
          dailyLeaderboard: convertLeaderboard(res.data)
        })
      } catch (e) {
        console.error("error fetching daily leaderboard")
      }
    },
    getAllLeaderboard: async () => {
      try {
        const res = await serverAPI.get("/puzzles/leaderboard/all")
        if(!res.data) throw new Error();
        set({
          allLeaderboard: convertLeaderboard(res.data)
        })
      } catch (e) {
        console.error("error fetching all leaderboard")
      }
    }
  }
})