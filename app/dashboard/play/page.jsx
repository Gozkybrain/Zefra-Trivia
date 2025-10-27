"use client";

import { useSearchParams } from "next/navigation";
import styles from "../profile/profile.module.css"; // reuse your style file

export default function PlayPage() {
  const params = useSearchParams();
  const opponentName = params.get("name");

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {opponentName ? (
          <>
            <h2 className={styles.username}>
              🎮 You’re about to start a game with {opponentName}
            </h2>
            <p className={styles.bio}>Get ready to test your trivia skills!</p>
          </>
        ) : (
          <>
            <h2 className={styles.username}>👀 Who do you want to play with?</h2>
            <p className={styles.bio}>
              Head over to <strong>Active Users</strong> and pick a player to challenge.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
