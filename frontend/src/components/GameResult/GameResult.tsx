import styles from "./GameResult.module.css";
import puzzlePiece from "../../assets/puzzle_piece.svg";

interface GameResultProps {
  closeResult: () => void,
  averageTime: string,
  highestScore: number,
  highestStreak: number
}

export default function GameResult({closeResult, averageTime, highestScore, highestStreak}: GameResultProps) {
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        <div className={styles.header}>
          <span className={styles.title}>Game Result</span>
          <button className={styles.closeBtn} onClick={closeResult}>×</button>
        </div>

        <div className={styles.pawnWrapper}>
          <img src={puzzlePiece} alt="Pawn" className={styles.pawnIcon} />
        </div>


        <div className={styles.score}>{highestScore || "--"}</div>

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.detailIcon}>🔥</span>
            <span>Longest Streak</span>
            <span className={styles.detailValue}>{highestStreak || "--"}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailIcon}>⏱️</span>
            <span>Avg Time per Puzzle</span>
            <span className={styles.detailValue}>{averageTime || "--"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
