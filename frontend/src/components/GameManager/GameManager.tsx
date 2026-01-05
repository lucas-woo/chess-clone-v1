import type { PlayerSide } from "../../types.ts"
import { useState, useEffect, useRef } from "react";
import styles from "./GameManager.module.css";
import puzzlePiece from "../../assets/puzzle_piece.svg";
import lightningSVG from "../../assets/lightning.svg";
import redCross from "../../assets/red.svg";
import { useGameStore } from "../../store/game-store.ts";
const GameManager = () => {

  const { startGame, getPuzzles, currentLevel, setCurrentPuzzle, currentPuzzle ,wrongAnswers, currentScore, incrementScore, incrementWrongAnswers, saveScore, stopCurrentPuzzle, resetGame, start321, setGameResult } = useGameStore()  
  const [lives, setLives] = useState<boolean[]>([false, false, false]);
  const [turn, setTurn] = useState<PlayerSide>("white");
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [inGame, setInGame] = useState<boolean>(true)
  const [streak, setStreak] = useState<number>(0)
  const [currentStreak, setCurrentStreak] = useState<number>(0)
  const timout = useRef(150);

  function goBack () {
    resetGame()
  }

  useEffect(() => {
    if (inGame) return

    saveScore()

    //send gameResult to Board, convert time left
    const averageTime = Math.round((180 - timeLeft) / (currentLevel.level || 1))
    let temp = streak

    if(currentStreak > streak){
      temp = currentStreak
    }
    console.log(averageTime)
    setGameResult(convertTime(averageTime), temp)

  }, [inGame])

  useEffect(() => {
    //if we add sockets later we can send sever time stamps and value here
    if(currentLevel.level < 1) return

    if(currentLevel){
      if((currentLevel.level % 5) === 2){
        getPuzzles()
      }
    }
    
    if(currentLevel.correctAnswer){
      setCurrentStreak((prev) => {
        return prev + 1
      })
      incrementScore()
      setTimeout(() => {
        setCurrentPuzzle()  
      }, timout.current);
    } else {
      incrementWrongAnswers()
    }

  }, [currentLevel]) 

  useEffect(() => {
    if(currentStreak > streak){
      setStreak(currentStreak)
      setCurrentStreak(0)
    }

    convertLives(wrongAnswers)
    if(wrongAnswers >= 3){
      setInGame(false)
    } else {
      setTimeout(() => {
        setCurrentPuzzle()  
      }, timout.current);
    }
  }, [wrongAnswers])

  useEffect(() => {
    if(!currentPuzzle) return
    setTurn(currentPuzzle.playerSide)
  }, [currentPuzzle])


  useEffect(() => {
    if(!startGame) return 
    if(!inGame) return
    if(timeLeft < 1) {
      stopCurrentPuzzle()
      setInGame(false)
    } else {
      setTimeout(() => {
        setTimeLeft((pre) => {
          return pre - 1;
        })
      }, 1000)
    }
  }, [timeLeft, startGame])
  
  useEffect(() => {
    return () => {
      resetGame()
    }
  }, [])

  const convertTime = (timer: number): string => {
    
    const minutes = Math.floor(timer/60)
    const tens = Math.floor((timer%60)/10)
    const seconds = timer - (minutes * 60) - (tens*10)
    return `${minutes}:${tens}${seconds}`
  }

  function convertLives (incorrect: number): void {
    let temp = [false, false, false]
    for(let i = 0; i <incorrect; i++){
      temp[i] = true
    }
    setLives(temp)
  }
  
  const onQuit = () => {
    if (start321) return
    stopCurrentPuzzle()
    setInGame(false)
  }
  
  return (
    <div className={styles.container}>
      <div
        className={`${styles.header} ${
          inGame ? styles.headerInGame : styles.headerOutGame
        }`}
      >
        {inGame ? (
          <>
            <div
              className={styles.turnBox}
              style={{ backgroundColor: turn === "black" ? "black" : "white" }}
            ></div>
            <span className={styles.headerText}>
              {turn === "black" ? "Black to Move" : "White to Move"}
            </span>
          </>
        ) : (
          <button className={styles.goBackButton} onClick={goBack}>
            Go Back
          </button>
        )}
      </div>



      <img src={puzzlePiece} alt="Pawn Icon" className={styles.pawnIcon} />


      <div className={styles.score}>{currentScore ? currentScore : "--"}</div>


      <div className={styles.timerBox}>
        <img
          src={lightningSVG}
          alt="Lightning Icon"
          className={styles.timerIcon}
        />
        <span className={styles.timerText}>{convertTime(timeLeft)}</span>
      </div>

      <div className={styles.bottomSection}>
        {/* Lives / Strikes */}
        <div className={styles.lives}>
          {lives.map((isWrong, idx) => (
            <div
              key={idx}
              className={`${styles.lifeBox} ${
                isWrong ? styles.wrong : styles.correct
              }`}
            >
              {isWrong && (
                <img src={redCross} alt="Wrong" className={styles.crossIcon} />
              )}
            </div>
          ))}
        </div>


        {
          inGame ? <button className={styles.quitButton} onClick={onQuit}>Quit</button> : <></>
        }
        
      </div>
    </div>
  );
};

export default GameManager;
