export interface UserType {
  username: string,
  hash?: string,
  authID?: string
  email: string,
  provider: string
  profilePicture: string
  highScore: number,
  isAdmin: boolean
}

export interface UserLeaderboard {
  username: string,
  profilePicture: string,
}

export interface LocalUserType extends UserType{
  hash: string,
}
export interface Auth2UserType extends UserType{
  authID: string,
}
export interface DeserializeUser {
  email: string,
  username: string
  profilePicture: string
  highScore: number  
}

export interface AuthResponse {
  err: boolean,
  username: string,
  profilePicture: string,
  highScore: number
}

export type PlayerSide = "white" | "black"

export type BoardPiece = 
"wk" | "wq" | "wn" | "wb" | "wr" | "wp" |
"bk" | "bq" | "bn" | "bb" | "br" | "bp";


export interface PiecePosition {
  piece: BoardPiece,
  placement: string
}

export type GameState = PiecePosition[]

export interface Puzzle {
  gameState: GameState,
  playerSide: PlayerSide,
  moves: string[],
  level: number
}

export interface ProfilePicture {
  imageName: string,
  url: string,
  publicID: string
}