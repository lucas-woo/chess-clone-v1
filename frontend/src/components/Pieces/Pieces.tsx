import { useDraggable } from "@dnd-kit/core"
import type { BoardPiece } from "../../types"
import styles from "./Pieces.module.css"
interface PiecesProps {
  piece: BoardPiece
  squareName: string
  player: boolean
}
const svg = "/pieces"


const Pieces = ({piece, squareName, player}: PiecesProps) => {

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: squareName,
    data: {
      piece: piece
    }
  })

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 999 : "auto",
    width: "80%",
    height: "80%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    
  };

  const styleOpp = {
    
    width: "80%",
    height: "80%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }
  
  return (
    <>
      {
        player ? 
          <img 
          {...listeners} 
          {...attributes}
          ref={setNodeRef}
          src={`${svg}/${piece}.svg`} 
          style={style}
          className={styles.noSelectPlayer}
          /> :
          <img 
          draggable={false}
          src={`${svg}/${piece}.svg`} 
          style={styleOpp}
          className={styles.noSelect}
          />
      }
    </>
  )
}

export default Pieces