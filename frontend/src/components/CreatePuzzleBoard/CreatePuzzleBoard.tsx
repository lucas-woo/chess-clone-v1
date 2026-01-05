import styles from "./CreatePuzzleBoard.module.css"
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import type { GameState, BoardPiece, Puzzle, Colour } from "../../types";
import { files, ranks, isValidMove, sortGamePosition } from "../../utils/board";
import Square from "../Square/Square";
import { useEffect, useState } from "react";



const CreatePuzzleBoard = ({ playerSide, gameState, moves }: Puzzle) => {
  const [activeBoard, setActiveBoard] = useState<[GameState, number]>() //positions | move



  useEffect(() => {
    setActiveBoard([sortGamePosition([...gameState], playerSide), 1])
  }, [gameState, playerSide, moves])



  useEffect(() => {
    botMove()
  }, [activeBoard])

  const isBotTurn = (): boolean => {
    if(!activeBoard) return false
    return activeBoard[1] % 2 !== 0
  }

  const botMove = () => {
    if (!isBotTurn() || !activeBoard || !moves.length || moves.length < activeBoard[1]) return
    
    const temp = moves[activeBoard[1] - 1].split(" ")
    const piece = temp[0] as BoardPiece
    const from = temp[1]
    const to = temp[2]
    const newBoard = activeBoard[0].filter((el) => {
      return (el.placement !== to && el.placement !== from)
    }) 
    newBoard.push({placement: to, piece})
    setTimeout(() => {
      setActiveBoard((prev) => {
        return [sortGamePosition(newBoard, playerSide), ((prev as [GameState, number])[1] + 1)]
      })
    }, 500)

  }

  const handleDragEnd = (event: DragEndEvent) => {
    const {over, active} = event
    if(!over) return 
    if(!activeBoard) return
    let piece = active.data.current?.piece 
    let from = active.id.toString()
    let to = over.id.toString()
    if(from === to) return // HIGHLIGHT SQUARES LATER
    if(!isValidMove(piece, from, to, activeBoard[0])) return
    if(moves.length < activeBoard[1]) return
    
    let movePlayed = `${piece} ${from} ${to}`
    if (movePlayed === moves[(activeBoard[1] - 1)]){
      
      if (moves.length === activeBoard[1]){
        
      //won green tick
        setActiveBoard((prev) => {
        //set auth board store 
        //set timer
        const newBoard = activeBoard[0].filter((el) => {
          return (el.placement !== to && el.placement !== from)
        }) 
        newBoard.push({piece, placement: to, colour: "green"})
        
        return [sortGamePosition(newBoard, playerSide), ((prev as [GameState, number])[1] + 1)]
        })

      } else {

        //correct move, continue puzzle
        setActiveBoard((prev) => {
        const newBoard = activeBoard[0].filter((el) => {
          return (el.placement !== to && el.placement !== from)
        }) 
        newBoard.push({piece, placement: to})
        return [sortGamePosition(newBoard, playerSide), ((prev as [GameState, number])[1] + 1)]
        })
      }
    } else {
      
      //red and move on
        setActiveBoard((prev) => {
          if(!prev)return prev
        //set auth board store 
        //set timer
        const newBoard = prev[0].filter((el) => {
          return (el.placement !== to && el.placement !== from)
        }) 
        newBoard.push({piece, placement: to, colour: "red"})
        
        return [sortGamePosition(newBoard, playerSide), moves.length + 1]
        })

        
    }
  }

  const isPlayerMove = (piece: BoardPiece): boolean => {
    if (!activeBoard) return false;
    return ((piece.split("")[0] === "w" && playerSide === "white") || (piece.split("")[0] === "b" && playerSide === "black")) && activeBoard[1] % 2 === 0
  }

  const board = [];
  const displayRanks = playerSide === "white" ? [...ranks].reverse() : ranks;
  const displayFiles = playerSide === "white" ? files : [...files].reverse();
  let i = 0
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {

      const isGreen = (r + f) % 2 === 1;
      const squareName = `${displayFiles[f]}${displayRanks[r]}`;
      let fileLabel = "";
      let rankLabel = "";
      let piece: BoardPiece | null = null;
      let player = false
      let colour: Colour = "none"
      if (r === 7) {
        fileLabel = displayFiles[f];
      }
      if (f === 0) {
        rankLabel = displayRanks[r];
      }

      if (!activeBoard) {
        board.push(<Square 
          player={false} 
          file={fileLabel} 
          rank={rankLabel} 
          squareName={squareName} 
          piece={null} 
          isGreen={isGreen} 
          key={`${r}${f}`} 
          colour={colour}/>)
      } else {

        if(i < activeBoard[0].length && activeBoard[0][i].placement === squareName){
          piece = activeBoard[0][i].piece
          player = isPlayerMove(piece)
          if (activeBoard[0][i].colour) colour = activeBoard[0][i].colour as Colour
          i++
        }
        board.push(
          <Square 
          player={player} 
          file={fileLabel} 
          rank={rankLabel} 
          squareName={squareName} 
          piece={piece} 
          isGreen={isGreen} 
          colour={colour}
          key={`${r}${f}`} 
          />
        )
      }
    }
  }
  i = 0

  return (
    <DndContext onDragEnd={handleDragEnd}>
    <div className={styles.board}>
      {board}
    </div>
    </DndContext>
  );
}

export default CreatePuzzleBoard