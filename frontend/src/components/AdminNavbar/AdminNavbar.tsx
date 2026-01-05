import styles from "./AdminNavbar.module.css"
import { NavLink } from "react-router"

const AdminNavbar = () => {
return (
    <nav className={styles["navbar"]}>
    <ul className={styles["nav-links"]}>
      <li><NavLink to="/" className={styles.navLink}>Home</NavLink></li>
      <li><NavLink to="/create" className={styles.navLink}>Create Puzzle</NavLink></li>
      <li><NavLink to="/puzzles" className={styles.navLink}>Puzzles</NavLink></li>
      <li><NavLink to="/vision" className={styles.navLink}>Vision</NavLink></li>
      <li><NavLink to="/leaderboards" className={styles.navLink}>Leaderboards</NavLink></li>
      <li><NavLink to="/social" className={styles.navLink}>Social</NavLink></li>
    </ul>

      <div className={styles.settings}>
        <NavLink to="/profile" className={styles.optionButton}>
          Profile
        </NavLink>
        <NavLink to="/settings" className={styles.optionButton}>
          Settings
        </NavLink>
      </div>
    </nav>
    
  )
}

export default AdminNavbar