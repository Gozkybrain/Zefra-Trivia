"use client";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../components/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import ActiveUsersCarousel from "@/components/ActiveUsersCarousel";
import AvailableGamesCarousel from "@/components/AvailableGamesCarousel";
import LeaderboardCarousel from "@/components/LeaderboardCarousel";

export default function Dashboard() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <ProtectedRoute>
      <main>
        <h1>Dashboard</h1>
        <p>Welcome, {user?.email}</p>
        <button onClick={handleLogout}>Logout</button>

        <ActiveUsersCarousel />

        <AvailableGamesCarousel />

        <LeaderboardCarousel />
      </main>
    </ProtectedRoute>
  );
}
