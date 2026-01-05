import { useState } from "react";
import LeaderboardDisplay from "../../components/LeaderboardDisplay/LeaderboardDisplay";
import crown from "../../assets/leaderboard_crown.svg";
import styles from "./Leaderboards.module.css";
const Leaderboards = () => {
  const [view, setView] = useState<"all" | "daily">("all");
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <img src={crown} alt="crown" className={styles.crown} />
        <h1 className={styles.title}>Global Leaderboards</h1>
      </div>

      <div className={styles.toggle}>
        <button
          className={`${styles.toggleButton} ${view === "all" ? styles.active : ""}`}
          onClick={() => setView("all")}
        >
          All
        </button>
        <button
          className={`${styles.toggleButton} ${view === "daily" ? styles.active : ""}`}
          onClick={() => setView("daily")}
        >
          Daily
        </button>
      </div>

      <LeaderboardDisplay display={view} />
    </div>
  );
};

export default Leaderboards;
