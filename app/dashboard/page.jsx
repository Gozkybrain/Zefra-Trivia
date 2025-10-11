"use client";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../components/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import ActiveUsersCarousel from "@/components/ActiveUsersCarousel";
import AvailableGamesCarousel from "@/components/AvailableGamesCarousel";
import LeaderboardCarousel from "@/components/LeaderboardCarousel";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <ProtectedRoute>
      <main className={styles.main}>
        <div className={styles.welcomeCard}>
         <div className={styles.avatarProfile}> {user?.avatar}</div>
          <div className={styles.userInfo}>
            <h2 className={styles.username}>{user?.username || "Unnamed User"}</h2>
            <p className={styles.email}>{user?.email}</p>
          </div>
          <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>

        <ActiveUsersCarousel />
        <AvailableGamesCarousel />
        <LeaderboardCarousel />
      </main>
    </ProtectedRoute>
  );
}
