import styles from "./Board.module.css";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import type { GameState, BoardPiece, Puzzle, Colour } from "../../types";
import { files, ranks, isValidMove, sortGamePosition } from "../../utils/board";
import GameResult from "../GameResult/GameResult";
import Square from "../Square/Square";
import { useEffect, useState } from "react";
import { useGameStore } from "../../store/game-store";

export default function Board({ playerSide, gameState, moves }: Puzzle) {
  const [activeBoard, setActiveBoard] = useState<[GameState, number]>() //positions | move
  const { start321, startGame, setStartGame, setStart321, incrementLevel, countdown, setCountdown, gameResult } = useGameStore()
  const [openResult, setOpenResult] = useState<boolean>(false)

  useEffect(() => {
    if(!gameResult) return
    setOpenResult(true)
  }, [gameResult])


  useEffect(() => {
    setActiveBoard([sortGamePosition([...gameState], playerSide), 1])
  }, [gameState, playerSide, moves])


  useEffect(() => {
    if(!start321 || startGame) return 
    let count = Number(countdown)
    let time = count === 3 ? 1500 : 1000
    setTimeout(() => {
      if(count > 1){
        setCountdown(`${count - 1}`);
      } else {
        setStartGame(true)
        setStart321(false)
        setActiveBoard([sortGamePosition([...gameState], playerSide), 1])
      }
    }, time);
  }, [countdown, startGame, start321]);

  useEffect(() => {
    botMove()
  }, [activeBoard, start321, startGame])

  const isBotTurn = (): boolean => {
    if(!activeBoard) return false
    return activeBoard[1] % 2 !== 0
  }

  const botMove = () => {
    if (!isBotTurn() || !activeBoard || !moves.length || moves.length < activeBoard[1] || start321 || !startGame ) return
    
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
        
        incrementLevel(true)

      } else {

        //correct move so continue puzzle
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

        
        incrementLevel(false)
        
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
      {
        openResult ? <div className={styles.overlay}>
          <GameResult 
            highestScore={gameResult?.score as number}
            highestStreak={gameResult?.highestStreak as number}
            averageTime={gameResult?.averageTime as string}
            closeResult={() => {setOpenResult(false)}}
          />
          </div> : <></>
      }
      
      {(!startGame && start321) && (
        <div className={styles.overlay}>
          <span className={styles.countdownText}>{countdown}</span>
        </div>
      )}
      {board}
    </div>
    </DndContext>
  );
}
