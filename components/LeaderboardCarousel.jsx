"use client";

import { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "../styles/LeaderboardCarousel.module.css";
import Link from "next/link";

export default function LeaderboardCarousel() {
  const [users, setUsers] = useState([]);
  const trackRef = useRef(null);
  const uidRef = useRef(Math.random().toString(36).substring(2, 9));
  const id = uidRef.current;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);

        let userList = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            username: data.username || data.displayName || "Unknown",
            avatarEmoji: data.avatar || data.avatarEmoji || "👤",
            createdAt: data.createdAt,
            stats: data.stats || { wins: 0, gamesPlayed: 0, losses: 0 },
          };
        });

        // sort by wins, then by join date
        userList.sort((a, b) => {
          const winsA = a.stats?.wins || 0;
          const winsB = b.stats?.wins || 0;
          if (winsB !== winsA) return winsB - winsA;
          const createdA = a.createdAt?.seconds || 0;
          const createdB = b.createdAt?.seconds || 0;
          return createdB - createdA;
        });

        setUsers(userList.slice(0, 7));
      } catch (err) {
        console.error("🔥 Error fetching leaderboard:", err);
      }
    };

    fetchLeaderboard();
  }, []);

  // 🌀 dynamic CSS for marquee animation
  useEffect(() => {
    const styleId = `marquee-style-${id}`;
    if (document.getElementById(styleId)) return;

    const durationSeconds = Math.max(12, (users.length || 1) * 3);

    const css = `
      .marquee-container-${id} {
        overflow: hidden;
        position: relative;
      }

      .marquee-track-${id} {
        display: flex;
        gap: 12px;
        align-items: stretch;
        will-change: transform;
        animation: marquee-${id} ${durationSeconds}s linear infinite;
      }

      @keyframes marquee-${id} {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }

      .marquee-container-${id}:hover .marquee-track-${id} {
        animation-play-state: paused;
      }

      .marquee-container-${id}::-webkit-scrollbar { display: none; }
      .marquee-container-${id} { -ms-overflow-style: none; scrollbar-width: none; }
    `;

    const styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.appendChild(document.createTextNode(css));
    document.head.appendChild(styleEl);

    return () => {
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();
    };
  }, [id, users.length]);

  const displayList = [...users, ...users];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Leaderboard</h2>

      {users.length === 0 ? (
        <p className={styles.empty}>No users yet... be the first champion 😎</p>
      ) : (
        <div className={`marquee-container-${id} ${styles.marqueeOuter}`}>
          <div
            ref={trackRef}
            className={`marquee-track-${id} ${styles.track}`}
            onMouseEnter={() => {
              if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
            }}
            onMouseLeave={() => {
              if (trackRef.current) trackRef.current.style.animationPlayState = "running";
            }}
          >
            {displayList.map((user, index) => (
              <Link
                key={`${user.id}-${index}`}
                href={`/dashboard/active/${user.id}`}
                className={styles.card}
              >
                <div className={styles.rank}>#{(index % users.length) + 1}</div>
                <div className={styles.avatar}>{user.avatarEmoji}</div>
                <p className={styles.username}>{user.username}</p>
                <div className={styles.stats}>
                  <span className={styles.win}>Wins: {user.stats.wins}</span>
                  <span className={styles.played}>Played: {user.stats.gamesPlayed}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
