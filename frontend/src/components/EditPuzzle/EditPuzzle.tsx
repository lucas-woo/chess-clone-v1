import { useState, useRef } from "react";
import { usePuzzleStore } from "../../store/puzzle-store"
import type {  BoardPiece, PiecePosition, PlayerSide } from "../../types"
import { sortGamePosition } from "../../utils/board";
import styles from "./EditPuzzle.module.css"

const EditPuzzle = () => {
  const submitted = useRef<boolean>(false)
  const buttonColour = useRef<string>(styles.submitButton)
  const [showError, setShowError] = useState("")
  const { setCurrentLevel, setCurrentPlayerSide, setCurrentGameState, currentGameState, setCurrentMoves, currentMoves, createPuzzle, currentLevel, currentPlayerSide } = usePuzzleStore();
  function onSideChange (e: React.ChangeEvent<HTMLSelectElement>) {
    setCurrentPlayerSide(e.target.value as PlayerSide)
  } 
  function onLevelChange (e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value)
    if (!val) return
    setCurrentLevel(val)
  } 

  function onAddPiece(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pieceName = formData.get("name") as BoardPiece;
    const placement = formData.get("placement") as string;
    const dupe = currentGameState.find((el) => el.placement === placement)
    if (!pieceName || !placement || dupe) return
    let newPosition: PiecePosition = {piece: pieceName, placement}
    setCurrentGameState([...currentGameState, newPosition])
  }

  function onRemovePiece(){
    if(!currentGameState.length) return
    setCurrentGameState(currentGameState.splice(0, currentGameState.length-1))
  }

  function onAddMove(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const piece = formData.get("piece") as BoardPiece;
    const from = formData.get("from") as string;
    const to = formData.get("to") as string;
    
    if (!piece || !from || !to) return 
    const curPlacement = `${piece} ${from} ${to}`
    const dupe = currentMoves.find((el) => el === curPlacement)
    if(dupe) return 
    setCurrentMoves([...currentMoves, curPlacement])
  }

  function onRemoveMove() {
    if(!currentMoves.length) return
    setCurrentMoves(currentMoves.splice(0, currentMoves.length -1))
  }

  async function onSubmitPuzzle(){
//    console.log(!currentGameState, !currentMoves, !currentPlayerSide, !currentLevel, submitted.current)
    if (!currentGameState || !currentMoves || !currentPlayerSide || !currentLevel || submitted.current) return
    submitted.current = true
    buttonColour.current = styles.submittedButton
    const created = await createPuzzle(sortGamePosition(currentGameState, currentPlayerSide), currentPlayerSide, currentMoves, currentLevel)
    if (created) {
      window.location.href = "http://localhost:5173/create"
    } else { 
      setShowError("ERROR, PLEASE CONTACT LUCAS")
    }
  }

  return (
    <div className={styles.container}>
      
      <label>
        Player side:
        <select onChange={onSideChange}>
          <option value="white">White</option>
          <option value="black">Black</option>
        </select>
      </label>
      
      
      <label>
        Puzzle level:
        <input
          type="number"
          onChange={onLevelChange}
        />
      </label>
      


      <form onSubmit={onAddPiece}>
        <label>
          Piece:
          <input type="text" name="name" />
        </label>
        <br />
        <label>
          Placement:
          <input type="text" name="placement" />
        </label>
        <br />
        <br />
        <button 
          type="submit" 
          className={styles.addButton}
          name="action"
          value="save"
        >Add</button>

        <button
          type="button"
          name="action"
          value="undo"
          className={styles.removeButton}
          onClick={onRemovePiece}
        >
          Remove
        </button>
      </form>


      <form onSubmit={onAddMove}>
        <label>
          Piece:
          <input type="text" name="piece" />
        </label>
        <br />
        <label>
          from:
          <input type="text" name="from" />
        </label>
        <br />
        <label>
          to:
          <input type="text" name="to" />
        </label>
        <br />
        <br/>
        <button 
          type="submit" 
          className={styles.addButton}
          name="action"
          value="save"
        >Add</button>

        <button
          type="button"
          name="action"
          value="undo"
          className={styles.removeButton}
          onClick={onRemoveMove}
        >
          Remove
        </button>
        
      </form>

      {
        showError && <h1 className={styles.showError}>{showError}</h1>
      }
      <button className={buttonColour.current} onClick={onSubmitPuzzle}>
        SUBMIT
      </button>
    </div>
  )
}

export default EditPuzzle