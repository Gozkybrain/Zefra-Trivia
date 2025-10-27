"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "../styles/ActiveUsersCarousel.module.css";
import Link from "next/link"; 

export default function ActiveUsersCarousel() {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "users"), where("isOnline", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setActiveUsers(users);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Active Users</h2>
        <Link href="/dashboard/active" className={styles.seeAll}>
          See all
        </Link>
      </div>

      {activeUsers.length === 0 ? (
        <p className={styles.noUsers}>No active users right now 😴</p>
      ) : (
        <div className={styles.carousel}>
          {activeUsers.map((user) => (
            <Link
              key={user.id}
              href={`/dashboard/active/${user.id}`}
              className={styles.userCard}
            >
              <div className={styles.avatar}>
                {user.avatar || "👽"}
              </div>
              <div className={styles.username}>
                {user.username || "Anon"} <span className={styles.active}>•</span>
              </div>
              <div className={styles.games}>
                Played {user?.stats?.gamesPlayed || 0} games
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
