import styles from "./CreatePuzzle.module.css"
import { sortGamePosition } from "../../utils/board"
import CreatePuzzleBoard from "../../components/CreatePuzzleBoard/CreatePuzzleBoard"
import EditPuzzle from "../../components/EditPuzzle/EditPuzzle"
import { usePuzzleStore } from "../../store/puzzle-store"
const CreatePuzzle = () => {
  const {currentPlayerSide, currentGameState, currentMoves} = usePuzzleStore()
  
  return (
    <div className={styles.container}>

      <CreatePuzzleBoard gameState={sortGamePosition([...currentGameState], currentPlayerSide)} playerSide={currentPlayerSide} moves={currentMoves}/>

      <EditPuzzle />

    </div>
  )
}

export default CreatePuzzle