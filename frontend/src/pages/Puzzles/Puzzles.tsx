import { sortGamePosition, initialBoard } from "../../utils/board";
import Board from "../../components/Board/Board";
import GameMenu from "../../components/GameMenu/GameMenu";
import styles from "./Puzzles.module.css";
import { useGameStore } from "../../store/game-store";
import GameManager from "../../components/GameManager/GameManager";
import { useRef } from "react";


const Puzzles = () => {
  const { start321, startGame, currentPuzzle } = useGameStore();
  
  const emptyArray = useRef([])
  
  return (
    <div className={styles.page}>
      <div className={styles.board}>
        <Board
          gameState={currentPuzzle ? currentPuzzle.gameState : sortGamePosition(initialBoard, "white")}
          playerSide={currentPuzzle ? currentPuzzle.playerSide : "white"}
          moves={currentPuzzle ? currentPuzzle.moves : emptyArray.current}
        />
      </div>
      {(start321 || startGame) ? (
        <div className={styles.menu}>
          <GameManager />
        </div>
      ) : (
        <div className={styles.menu}>
          <GameMenu />
        </div>
      )}
    </div>
  );
};

export default Puzzles;
