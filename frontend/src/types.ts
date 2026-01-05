export type BoardPiece = 
"wk" | "wq" | "wn" | "wb" | "wr" | "wp" |
"bk" | "bq" | "bn" | "bb" | "br" | "bp";

export type Piece = 
"k" | "q" | "r" | "b" | "p" | "n";

export type PlayerSide = "white" | "black"

export interface PiecePosition {
  piece: BoardPiece,
  placement: string
  colour ?: Colour
}

export type Colour = "red" | "green" | "none"

export type GameState = PiecePosition[]

export type FileBoard = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h"
export type RankBoard = 1 | 2 | 3 | 4 | 5 | 6| 7 | 8;

export interface Puzzle {
  gameState: GameState,
  playerSide: PlayerSide,
  moves: string[]
}

export interface ServerError {
  err: boolean
}

export interface ServerAuthResponse extends ServerError {
  username: string,
  isAdmin: boolean,
  profilePicture: string,
  highScore: number
}

export interface UserLeaderboard {
  username: string,
  profilePicture: string,
}

export interface UserLeaderboardDisplay {
  score: number,
  username: string,
  profilePicture: string | null
}