import { create } from "zustand";
import type { GameState, PlayerSide } from "../types";
import { serverAPI } from "../utils/connect-axios";

interface CreatePuzzle {
  newPuzzle: string,
  createPuzzle: (
    gameState: GameState,
    playerSide: PlayerSide,
    moves: string[],
    level: number
  ) => Promise<boolean>,
  deletePuzzle: () => Promise<boolean>,
  currentPlayerSide: PlayerSide,
  setCurrentPlayerSide: (side: PlayerSide) => void
  currentGameState: GameState,
  setCurrentGameState: (game: GameState) => void
  currentLevel: number,
  setCurrentLevel: (lvl: number) => void
  currentMoves: string[]
  setCurrentMoves: (moves: string[]) => void
}

export const usePuzzleStore = create<CreatePuzzle>((set, get) => {
  return {
    newPuzzle: "",
    createPuzzle: async (gameState, playerSide, moves, level) => {
      try {
        const created = await serverAPI.post("/admin/create", {
          gameState,
          playerSide,
          moves,
          level
        })
        
        if (!created.data.id) throw new Error
        set(() => {
          return {
            newPuzzle: created.data.id
          }
        })
        return true
      } catch (e) {
        console.error("error creating puzzle")
        return false
      }
    },
    deletePuzzle: async () => {
      try {
        const newPuzzle = await get().newPuzzle
        console.log(newPuzzle)
        if(!newPuzzle) throw new Error()
        const deleted = await serverAPI.delete("/admin/delete", {
          data: {
            puzzleID: newPuzzle
          }
        })
        if (!deleted.data.deleted) throw new Error()
        set(() => {
          return {
            newPuzzle: ""
          }
        })
        return true
        // console.log('puzzle deleted')
        
      } catch (e) {
        console.error("error deleting puzzle")
        return false
      }
    },

    currentPlayerSide: "white",
    currentGameState: [],
    currentMoves: [],
    currentLevel: 0,
    setCurrentPlayerSide: (side) => {
      set({currentPlayerSide: side})
    },
    setCurrentGameState(game) {
      set({currentGameState: game})
    },
    setCurrentLevel(lvl) {
      set({currentLevel: lvl})
    },
    setCurrentMoves(moves) {
      set({currentMoves: moves})
    },
  };
});
