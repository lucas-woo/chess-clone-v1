import { create } from 'zustand'
import type { Puzzle } from "../types.ts"
import { useAuthStore } from './auth-store.ts'
import { serverAPI } from '../utils/connect-axios'
interface GameStore {
  start321: boolean,
  startGame: boolean,
  currentLevel: {
    level: number,
    correctAnswer: boolean
  }, 
  countdown: string,
  wrongAnswers: number,
  puzzles: Puzzle[],
  currentPuzzle: Puzzle | null;
  currentScore: number,
  gameResult: {
    averageTime: string,
    highestStreak: number,
    score: number
  } | null,
  setGameResult: (averageTime: string, highestStreak: number) => void
  saveScore: () => void,
  incrementScore: () => void,
  clearPuzzles: () => void,
  getPuzzles: () => void,
  incrementLevel: (correctAnswer: boolean) => void,
  setStart321: (value: boolean) => void,
  setStartGame: (value: boolean) => void,
  incrementWrongAnswers: () => void,
  setCurrentPuzzle: () => void,
  stopCurrentPuzzle: () => void,
  resetGame: () => void,
  setCountdown: (val: string) => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  currentScore: 0,
  wrongAnswers: 0,
  currentLevel: {
    level: 0,
    correctAnswer: true
  },
  startGame: false,
  puzzles: [],
  start321: false,
  currentPuzzle: null,
  countdown: "3",
  gameResult: null,
  setGameResult: (averageTime, highestStreak) => {
    set({
      gameResult: {
        highestStreak,
        averageTime,
        score: get().currentScore
      }
    })
  },
  setCountdown: (val) => {
    set({
      countdown: val
    })
  },
  saveScore: async() => {
    try {
      const { authenticateUser, getTodayRank } = useAuthStore.getState();
      
      const res = await serverAPI.put("/puzzles/update", {
        score: get().currentScore
      })
      
      const { err, updated } = res.data
      if (err) throw new Error();
      if(updated){
        await authenticateUser();
        await getTodayRank()
      }
    } catch (e) {
      console.error("error updating score")
    }
  },
  incrementScore: () => {
    set({
      currentScore: (get().currentScore +1)
    })
  },
  clearPuzzles: () => {
    set({
      puzzles: []
    })
  },
  getPuzzles: async () => {
    try {
      if (get().puzzles.length > ((Math.floor((get().currentLevel.level) / 5) + 1) * 5)) return 
      const level = get().currentLevel.level === 0 ? 1 : ((Math.floor((get().currentLevel.level) / 5)) + 2);
      const res = await serverAPI.get("/puzzles", {
        params: {
          level: level
        }
      })
      if(!res.data) throw new Error()
      set({
        puzzles: [...get().puzzles, ...res.data]
      })
    } catch (e) {
      console.log("server error")
    }
  },
  incrementLevel: (correctAnswer) => {
    return set({
      currentLevel: {
        level: (get().currentLevel.level +1),
        correctAnswer
      }
    })
  },
  setStart321: (value) => {
    set({
      start321: value
    })
  },
  setStartGame(value) {
    set({
      startGame: value
    })    
  },
  incrementWrongAnswers: () => {
    set({
      wrongAnswers: (get().wrongAnswers + 1)
    })
  },
  setCurrentPuzzle: () => {
    let temp = get().puzzles
    if(!temp.length) return
    set({
      currentPuzzle: get().puzzles[get().currentLevel.level]
    })
  },
  stopCurrentPuzzle: () => {
    if(!get().currentPuzzle) return
    set({
      currentPuzzle: {
        moves: [],
        playerSide: get().currentPuzzle?.playerSide || "white", 
        gameState: get().currentPuzzle?.gameState || []
      }
    })
  },
  resetGame: () => {
    set({
      currentScore: 0,
      wrongAnswers: 0,
      currentLevel: {
        level: 0,
        correctAnswer: true
      },
      startGame: false,
      puzzles: [],
      start321: false,
      currentPuzzle: null,
      countdown: "3",
      gameResult: null
    })
  }
}))
