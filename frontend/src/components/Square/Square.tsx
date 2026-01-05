import styles from "./Square.module.css"
import type { BoardPiece, Colour } from "../../types"
import Pieces from "../Pieces/Pieces"
import { useDroppable } from "@dnd-kit/core"

interface SquareProps {
  piece: BoardPiece | null
  isGreen: boolean,
  squareName: string,
  file: string,
  rank: string,
  player: boolean,
  colour : Colour
}

const Square = ({piece, isGreen, squareName, file, rank, player, colour}: SquareProps) => {

  const {setNodeRef} = useDroppable({
    id: squareName,
    data: {
      piece: piece || false,
    }
  })

  const redOrGreen = colour === "none" ? null : colour

  return (
    <div className={`${styles.square} ${styles.greenSquare} ${isGreen ? styles.greenSquare : styles.whiteSquare}`.trim()} ref={setNodeRef}>
      {redOrGreen && <img
        src={`/puzzle/${redOrGreen}.svg`}
        className={styles.isCorrect}
      />}
      {rank && <span className={styles.labelRank}>{rank}</span>}
      {file && <span className={styles.labelFile}>{file}</span>}
      {piece && <Pieces piece={piece} squareName={squareName} player={player}/>}
    </div>
  )
}

export default Square