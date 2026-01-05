import styles from "./LoggedNavbar.module.css"
import { NavLink } from "react-router"
const LoggedNavbar = () => {
    return (
    <nav className={styles["navbar"]}>
    <ul className={styles["nav-links"]}>
      <li><NavLink to="/" className={styles.navLink}>Home</NavLink></li>
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

export default LoggedNavbar