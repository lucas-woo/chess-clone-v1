import type { PiecePosition, Puzzle } from "../../types/types.ts";
import mongoose from "mongoose";


const positionShema = new mongoose.Schema<PiecePosition>({
  piece: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  placement: {
    type: mongoose.Schema.Types.String,
    required: true, 
  }
}, { _id: false })

const puzzleSchema = new mongoose.Schema<Puzzle>({
  gameState: {
    type: [positionShema],
    required: true
  },
  playerSide: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  moves: {
    type: [mongoose.Schema.Types.String],
    required: true
  },
  level: {
    type: mongoose.Schema.Types.Number,
    required: true
  }
})

export const PuzzleModel = mongoose.model<Puzzle>("puzzles", puzzleSchema)