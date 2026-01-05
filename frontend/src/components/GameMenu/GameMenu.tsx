import styles from "./GameMenu.module.css";
import puzzlePiece from "../../assets/puzzle_piece.svg";
import lightingSVG from "../../assets/lightning.svg";
import { useAuthStore } from "../../store/auth-store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useGameStore } from "../../store/game-store";
const GameMenu = () => {
  const { isAuthenticated, todayHighScore, todayRank, allHighScore, getTodayRank } = useAuthStore();
  const { start321, setStart321, getPuzzles, setCurrentPuzzle, puzzles, currentPuzzle, currentLevel, startGame } = useGameStore()
  const [highScore, setHighScore] = useState<string>("--");
  const [dailyHighScore, setDailyHighScore] = useState<string>("--");
  const [rank, setRank] = useState<string>("#");

  useEffect(() => {
    if(!puzzles.length) return
    if(Math.floor(currentLevel.level / 5) > 0) return
    setCurrentPuzzle()
  }, [puzzles])

  useEffect(() => {
    if(!currentPuzzle || currentLevel.level !== 0) return
    
    setStart321(true)
  }, [currentPuzzle])

  useEffect(() => {
    getTodayRank()
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!allHighScore) {
      setHighScore("--")
    } else {
      setHighScore(`${
        allHighScore
      }`);
    }
    if (!todayHighScore) {
      setDailyHighScore("--")
    } else {
      setDailyHighScore(`${todayHighScore}`);
    }
    if (todayRank === null){
      setRank("#") 
    } else {
      setRank(`#${todayRank}`);
    }
  }, [isAuthenticated, todayHighScore, todayRank, allHighScore]);
  
  const navigate = useNavigate();
  const handleSignUp = () => {
    navigate("/login")
  };
  const handleStartGame = async () => {
    
    if(start321 || startGame) return
    
    await getPuzzles()
  }
  return (
    <div className={styles.container}>

      <div className={styles.mainContent}>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.active}`}>Play</button>
          <button
            className={styles.tab}
            onClick={() => {
              navigate("/leaderboards");
            }}
          >
            Leaderboard
          </button>
        </div>


        <img
          src={puzzlePiece}
          alt="Puzzle Icon"
          className={styles.puzzleIcon}
        />


        <div className={styles.scoreSection}>
          <div className={styles.scoreItem}>
            <span className={styles.scoreLabel}>DAILY SCORE</span>
            <span className={styles.scoreValue}>{dailyHighScore}</span>
          </div>

          <div className={styles.scoreItem}>
            <span className={styles.scoreLabel}>DAILY RANK</span>
            <span className={styles.scoreValue}>{rank}</span>
          </div>
          
        </div>

        <div className={styles.scoreItem}>
          <span className={styles.scoreLabel}>HIGH SCORE</span>
          <span className={styles.scoreValue}>{highScore}</span>
        </div>        
          <br/>
          <br/>

        <div className={styles.timerBox}>
          <img
            src={lightingSVG}
            alt="Lightning Icon"
            className={styles.timerIcon}
          />
          <span className={styles.timerText}>3 min</span>
          
        </div>
        
      </div>


      <div className={styles.bottomSection}>

        <div className={styles.lives}>
          <div className={styles.lifeBox}>_</div>
          <div className={styles.lifeBox}>_</div>
          <div className={styles.lifeBox}>_</div>

        </div>


        {isAuthenticated ? (
          <button className={styles.playButton} onClick={handleStartGame}>
            Start
          </button>
        ) : (
          <button className={styles.signUpBtn} onClick={handleSignUp}>
            Login To Play
          </button>
        )}
      </div>
    </div>
  );
};

export default GameMenu;
