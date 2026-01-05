import GuestNavbar from "../../components/GuestNavbar/GuestNavbar";
import LoggedNavbar from "../../components/LoggedNavbar/LoggedNavbar";
import styles from './Dashboard.module.css';
import { Outlet } from "react-router";
import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/auth-store";
interface DashboadProps {
  isAdmin: boolean,
  isAuthenticated: boolean
}

const Dashboard = ({isAdmin, isAuthenticated}: DashboadProps) => {

  const { username } = useAuthStore()

  const navigate = useNavigate()

  useEffect(() => {
    if(!username && isAuthenticated) {
      navigate("/change-username")
    }
  }, [isAuthenticated])
    
  return (
    <div>
       {isAdmin && isAuthenticated ? <AdminNavbar /> : isAuthenticated ? <LoggedNavbar /> : <GuestNavbar />}
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;