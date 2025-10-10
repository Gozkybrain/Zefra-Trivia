// components/LeaderboardCarousel.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LeaderboardCarousel() {
  const [users, setUsers] = useState([]);
  const trackRef = useRef(null);
  const uidRef = useRef(Math.random().toString(36).substring(2, 9)); // unique id for CSS
  const id = uidRef.current;

  // fetch users (top 7 by wins, fallback to recent)
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

        // Sort by wins desc then createdAt desc
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

  // Inject marquee CSS (unique per component instance)
  useEffect(() => {
    // we only need to insert style once for this component instance
    const styleId = `marquee-style-${id}`;
    if (document.getElementById(styleId)) return;

    // Choose duration relative to item count for a comfortable speed
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
        /* make the track width effectively 200% because we duplicate items in JSX */
        will-change: transform;
        animation: marquee-${id} ${durationSeconds}s linear infinite;
      }
      @keyframes marquee-${id}{
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      /* pause on hover */
      .marquee-container-${id}:hover .marquee-track-${id} {
        animation-play-state: paused;
      }
      /* hide scrollbar for webkit */
      .marquee-container-${id}::-webkit-scrollbar { display: none; }
      /* hide scrollbar for firefox/edge */
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

  // Duplicate the list so the track can translate -50% and loop seamlessly
  const displayList = [...users, ...users];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏆 Leaderboard</h2>

      {users.length === 0 ? (
        <p style={styles.empty}>No users yet... be the first champion 😎</p>
      ) : (
        <div className={`marquee-container-${id}`} style={styles.marqueeOuter}>
          <div
            ref={trackRef}
            className={`marquee-track-${id}`}
            // allow mouse dragging to interact naturally with the content
            style={{
              ...styles.track,
            }}
            // pause on mouse enter via JS fallback (CSS already handles hover)
            onMouseEnter={() => {
              if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
            }}
            onMouseLeave={() => {
              if (trackRef.current) trackRef.current.style.animationPlayState = "running";
            }}
          >
            {displayList.map((user, index) => (
              <div key={`${user.id}-${index}`} style={styles.card}>
                <div style={styles.rank}>#{(index % users.length) + 1}</div>
                <div style={styles.avatar}>{user.avatarEmoji}</div>
                <p style={styles.username}>{user.username}</p>
                <div style={styles.stats}>
                  <span style={styles.win}>Wins: {user.stats.wins}</span>
                  <span style={styles.played}>Played: {user.stats.gamesPlayed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "14px",
    background: "#f9f9f9",
    borderRadius: "8px",
    marginTop: "10px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "8px",
  },
  empty: {
    color: "#777",
    fontStyle: "italic",
  },
  marqueeOuter: {
    width: "100%",
  },
  track: {
    display: "flex",
    gap: "12px",
    alignItems: "stretch",
  },
  card: {
    flex: "0 0 auto",
    width: "160px",
    background: "white",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    position: "relative",
  },
  rank: {
    position: "absolute",
    top: "6px",
    right: "10px",
    fontSize: "12px",
    color: "#888",
  },
  avatar: {
    fontSize: "40px",
    marginBottom: "6px",
  },
  username: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    margin: "2px 0 6px",
    textAlign: "center",
  },
  stats: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: "12px",
    color: "#555",
  },
  win: {
    fontWeight: "700",
    color: "#2e7d32",
  },
  played: {
    color: "#757575",
  },
};
