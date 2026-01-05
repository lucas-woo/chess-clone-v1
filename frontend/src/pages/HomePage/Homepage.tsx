import styles from './Homepage.module.css';
import chessboardImage from '../../assets/chess_com_board.png'; 
import { NavLink } from 'react-router';

const Homepage = () => {

  return (
    <div className={styles.boardContainer}>
      <NavLink to={"puzzles"} end>
      <img
        src={chessboardImage}
        alt="Chess Board"
        className={styles.chessBoard}
      />
      </NavLink>
    </div>
  );
};

export default Homepage;
