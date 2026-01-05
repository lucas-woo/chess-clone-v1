import type { GameState, FileBoard, PlayerSide, BoardPiece, Piece } from "../types";

export enum White {
  a = 0,
  b,
  c,
  d,
  e,
  f,
  g,
  h
}

export enum Black {
  h = 0,
  g,
  f,
  e,
  d,
  c,
  b,
  a
}

export const getPosition = (position: string, turn: "black" | "white") => {
  const [file, rank] = position.split("")
  return turn === "white" ? (((8 - Number(rank)) * 8) + (White[file as FileBoard])) : (((Number(rank) - 1) * 8) + Black[file as FileBoard]) ; 
}

export const sortGamePosition = (gameState: GameState, playerSide: PlayerSide): GameState => {
  gameState.sort((a,b) => {
  return getPosition(a.placement, playerSide) - getPosition(b.placement, playerSide)
  })
  return gameState
}

export const initialBoard: GameState = [
  {piece: "wp", placement: "a2"},
  {piece: "wp", placement: "b2"},
  {piece: "wp", placement: "c2"},
  {piece: "wp", placement: "d2"},
  {piece: "wp", placement: "e2"},
  {piece: "wp", placement: "f2"},
  {piece: "wp", placement: "g2"},
  {piece: "wp", placement: "h2"},
  {piece: "wr", placement: "a1"},
  {piece: "wn", placement: "b1"},
  {piece: "wb", placement: "c1"},
  {piece: "wq", placement: "d1"},
  {piece: "wk", placement: "e1"},
  {piece: "wb", placement: "f1"},
  {piece: "wn", placement: "g1"},
  {piece: "wr", placement: "h1"},

  {piece: "bp", placement: "a7"},
  {piece: "bp", placement: "b7"},
  {piece: "bp", placement: "c7"},
  {piece: "bp", placement: "d7"},
  {piece: "bp", placement: "e7"},
  {piece: "bp", placement: "f7"},
  {piece: "bp", placement: "g7"},
  {piece: "bp", placement: "h7"},
  {piece: "br", placement: "a8"},
  {piece: "bn", placement: "b8"},
  {piece: "bb", placement: "c8"},
  {piece: "bq", placement: "d8"},
  {piece: "bk", placement: "e8"},
  {piece: "bb", placement: "f8"},
  {piece: "bn", placement: "g8"},
  {piece: "br", placement: "h8"},
]

export const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const rankR = ["8", "7", "6", "5", "4", "3", "2", "1"]

// export const validateMove = (piece: BoardPiece, from: string, to: string, gameState: GameState):boolean => {

//   let movingPiece: Piece = piece.split("")[1] as Piece
//   let fromFile: FileBoard = from.split("")[0] as FileBoard
//   let fromRank: RankBoard = Number(from.split("")[1]) as RankBoard
//   let toFile: FileBoard = to.split("")[0] as FileBoard
//   let toRank: RankBoard = Number(to.split("")[1]) as RankBoard

//   console.log(movingPiece, from, to, fromFile, fromRank, toFile, toRank)
//   switch (movingPiece) {
//     case "b":  
//       let r = ((White[toFile] > White[fromFile] ) && (toRank > fromRank)) || ((White[toFile] < White[fromFile] ) && (toRank < fromRank)) ? ranks : rankR;
//       console.log(r)
//       const diff = (White[fromFile] + 1) - fromRank 
//       console.log(diff)
//       break;
//     case "k":

//       break
//     case "n":
//       break
//     case "p":
//       break
//     case "q":
//       break
//     case "r":


//   }



//   return false
// }

//AI

const fileToIndex = (file: string): number => file.charCodeAt(0) - 'a'.charCodeAt(0)
const rankToIndex = (rank: string): number => parseInt(rank) - 1
const isSameColor = (a: BoardPiece, b: BoardPiece): boolean => a[0] === b[0]
const getPieceAt = (pos: string, gameState: GameState): BoardPiece | undefined => {
  return gameState.find(p => p.placement === pos)?.piece
}
const getColor = (piece: BoardPiece): PlayerSide => piece[0] === 'w' ? "white" : "black"


function simulateMove(
  piece: BoardPiece,
  from: string,
  to: string,
  gameState: GameState
): GameState {
  return gameState
    .filter(p => p.placement !== from && p.placement !== to) 
    .concat({ piece, placement: to })
}

function findKingPosition(gameState: GameState, side: PlayerSide): string | undefined {
  const kingCode: BoardPiece = side === "white" ? "wk" : "bk"
  return gameState.find(p => p.piece === kingCode)?.placement
}

function isSquareAttacked(pos: string, bySide: PlayerSide, gameState: GameState): boolean {
  for (const { piece, placement } of gameState) {
    if (getColor(piece) !== bySide) continue
    if (isValidMove(piece, placement, pos, gameState, true)) {
      return true
    }
  }
  return false
}


export function isValidMove(
  piece: BoardPiece,
  from: string,
  to: string,
  gameState: GameState,
  skipCheckValidation: boolean = false
): boolean {
  const fx = fileToIndex(from[0])
  const fy = rankToIndex(from[1])
  const tx = fileToIndex(to[0])
  const ty = rankToIndex(to[1])
  const dx = tx - fx
  const dy = ty - fy
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)

  const destinationPiece = getPieceAt(to, gameState)
  if (destinationPiece && isSameColor(piece, destinationPiece)) return false

  const isPathClear = (): boolean => {
    const stepX = dx === 0 ? 0 : dx / absDx
    const stepY = dy === 0 ? 0 : dy / absDy
    for (let i = 1; i < Math.max(absDx, absDy); i++) {
      const x = fx + stepX * i
      const y = fy + stepY * i
      const pos = String.fromCharCode('a'.charCodeAt(0) + x) + (y + 1)
      if (getPieceAt(pos, gameState)) return false
    }
    return true
  }

  const type = piece[1] as Piece
  const color = getColor(piece)

  let legal = false
  switch (type) {
    case 'p': {
      const dir = color === "white" ? 1 : -1
      const startRank = color === "white" ? 1 : 6
      const isStart = fy === startRank
      const isForwardMove = dx === 0 && dy === dir
      const isDoubleMove = dx === 0 && dy === dir * 2 && isStart
      const isCapture = absDx === 1 && dy === dir && destinationPiece

      if (isForwardMove && !destinationPiece) legal = true
      if (isDoubleMove && !destinationPiece && isPathClear()) legal = true
      if (isCapture) legal = true
      break
    }
    case 'r':
      if (dx === 0 || dy === 0) legal = isPathClear()
      break
    case 'b':
      if (absDx === absDy) legal = isPathClear()
      break
    case 'q':
      if (dx === 0 || dy === 0 || absDx === absDy) legal = isPathClear()
      break
    case 'n':
      legal = (absDx === 1 && absDy === 2) || (absDx === 2 && absDy === 1)
      break
    case 'k':
      legal = absDx <= 1 && absDy <= 1
      break
  }

  
  if (legal && !skipCheckValidation) {
    const simulated = simulateMove(piece, from, to, gameState)
    const kingPos = findKingPosition(simulated, color)
    if (!kingPos) return false 
    if (isSquareAttacked(kingPos, color === "white" ? "black" : "white", simulated)) {
      return false
    }
  }

  return legal
}