import styles from "./LeaderboardDisplay.module.css";
import { useLeaderboardStore } from "../../store/leaderboard-store";
import { useEffect } from "react";
import { useAuthStore } from "../../store/auth-store";
import defaultProfilePicture from "../../assets/default_pfp.svg"

interface LeaderboardDisplayProps {
  display: "all" | "daily",
}

const LeaderboardDisplay = ({ display }: LeaderboardDisplayProps) => {
  const { username } = useAuthStore();

  const { getDailyLeaderboard, getAllLeaderboard, allLeaderboard, dailyLeaderboard } = useLeaderboardStore()
  useEffect(() => {
    getAllLeaderboard();
    getDailyLeaderboard();
  }, [])
  return (
  <>
  {
    allLeaderboard && dailyLeaderboard ? 
        <div className={styles.leaderboard}>
      {(display == "all" ? allLeaderboard : dailyLeaderboard).map((user, index) => {

        let rankClass: string = styles.rank;
        let isUser: boolean = false;
        if (index === 0) rankClass = styles.gold;
        if (index === 1) rankClass = styles.silver;
        if (index === 2) rankClass = styles.bronze;
        if (user.username === username){
          isUser = true
        }
        return (
        
        <div key={index} className={isUser ? styles.userRow : styles.row}>
          <span className={rankClass}>#{index + 1}</span>
          <img
            src={user.profilePicture || defaultProfilePicture}
            alt={user.username}
            className={styles.avatar}
          />
          <span className={styles.username}>{user.username}</span>
          <span className={styles.score}>{user.score}</span>
        </div>
      )})}
    </div> :
    <></>
  }
  </>
  )
}

export default LeaderboardDisplay