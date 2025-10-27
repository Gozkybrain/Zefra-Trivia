"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import styles from "./active.module.css";
import { useRouter } from "next/navigation";

// 🕒 Time helper
function timeAgo(date) {
  if (!date) return "unknown";
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

export default function ActiveUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, "users"), where("isOnline", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newUsers = [];

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          const createdAt = data.createdAt?.seconds
            ? new Date(data.createdAt.seconds * 1000)
            : null;

          const userData = {
            id: change.doc.id,
            ...data,
            joined: createdAt ? timeAgo(createdAt) : "unknown",
          };

          newUsers.push(userData);
        }
      });

      if (newUsers.length > 0) {
        setUsers((prev) => {
          // avoid duplicates
          const merged = [...prev];
          newUsers.forEach((u) => {
            if (!merged.find((m) => m.id === u.id)) merged.push(u);
          });
          return merged;
        });
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>🟢 Active Users</h2>

      {loading && users.length === 0 && (
        <div className={styles.center}>
          <div className={styles.loader}></div>
          <p>Loading active users...</p>
        </div>
      )}

      {users.length === 0 && !loading && (
        <div className={styles.center}>
          <p>No active users right now 😴</p>
        </div>
      )}

      <div className={styles.userGrid}>
        {users.map((user) => (
          <div
            key={user.id}
            className={styles.userCard}
            onClick={() => router.push(`/dashboard/active/${user.id}`)}
          >
            <div className={styles.avatar}>{user.avatar || "👽"}</div>
            <div className={styles.userInfo}>
              <div className={styles.nameRow}>
                <h3 className={styles.username}>{user.username || "Anon"}</h3>
                <span className={styles.onlineDot}></span>
              </div>
              <p className={styles.meta}>
                Joined {user.joined} • {user?.stats?.gamesPlayed || 0} games played
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
