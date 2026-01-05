import styles from "./Settings.module.css"
import { useAuthStore } from "../../store/auth-store"
import { useNavigate } from 'react-router';

const Settings = () => {
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  const logUserOut = () => {
    logout()
    navigate("/")
  }
  return (
    <div>
      <button className={styles.logoutButton} onClick={logUserOut}>
        Logout
      </button>
    </div>
  )
}

export default Settings