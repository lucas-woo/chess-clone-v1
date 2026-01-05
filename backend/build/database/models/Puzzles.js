import mongoose from "mongoose";
const positionShema = new mongoose.Schema({
    piece: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    placement: {
        type: mongoose.Schema.Types.String,
        required: true,
    }
}, { _id: false });
const puzzleSchema = new mongoose.Schema({
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
});
export const PuzzleModel = mongoose.model("puzzles", puzzleSchema);
