import styles from "./GuestNavbar.module.css"
import { NavLink } from "react-router";
const GuestNavbar = () => {
  return (
    <nav className={styles["navbar"]}>
    <ul className={styles["nav-links"]}>
      <li><NavLink to="/" className={styles.navLink}>Home</NavLink></li>
      <li><NavLink to="/puzzles" className={styles.navLink}>Puzzles</NavLink></li>
      <li><NavLink to="/vision" className={styles.navLink}>Vision</NavLink></li>
      <li><NavLink to="/leaderboards" className={styles.navLink}>Leaderboards</NavLink></li>
      <li><NavLink to="/social" className={styles.navLink}>Social</NavLink></li>
    </ul>

      <div className={styles.authButtons}>
        <NavLink to="/signup" className={`${styles.navLink} ${styles.registerButton}`}>
          Sign Up
        </NavLink>
        <NavLink to="/login" className={`${styles.navLink} ${styles.loginButton}`}>
          Login
        </NavLink>
      </div>
    </nav>
  )
}

export default GuestNavbar