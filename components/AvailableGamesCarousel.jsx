"use client";

import { useEffect, useRef, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthProvider";

export default function AvailableGamesCarousel() {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [scrollActive, setScrollActive] = useState(false);
  const trackRef = useRef(null);
  const uidRef = useRef(Math.random().toString(36).substring(2, 9));
  const id = uidRef.current;

  // 🔥 Fetch available games and creator info
  useEffect(() => {
    const q = query(
      collection(db, "games"),
      where("type", "in", ["online", "p2p"]),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const gameList = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          let creator = { username: "Unknown", avatar: "🎮" };

          if (data.playerA) {
            try {
              const userDoc = await getDoc(doc(db, "users", data.playerA));
              if (userDoc.exists()) {
                const u = userDoc.data();
                creator = {
                  username: u.username || u.displayName || "Unknown",
                  avatar: u.avatar || "👤",
                };
              }
            } catch (e) {
              console.warn("Error fetching user:", e);
            }
          }

          return {
            id: docSnap.id,
            ...data,
            creator,
          };
        })
      );
      setGames(gameList);
    });

    return () => unsubscribe();
  }, []);

  // 🧭 Scroll only if items overflow
  useEffect(() => {
    if (games.length <= 1) {
      setScrollActive(false);
      return;
    }

    const checkWidth = () => {
      const container = document.querySelector(`.marquee-container-${id}`);
      const track = document.querySelector(`.marquee-track-${id}`);
      if (container && track) {
        const shouldScroll = track.scrollWidth > container.clientWidth;
        setScrollActive(shouldScroll);
      }
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, [games, id]);

  // 🎨 Dynamic scroll animation
  useEffect(() => {
    const styleId = `marquee-style-${id}`;
    if (document.getElementById(styleId)) return;

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
        animation: marquee-${id} 18s linear infinite;
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
  }, [id]);

  // ⚡ Handle accept/reject
  const handleAccept = async (gameId) => {
    try {
      await updateDoc(doc(db, "games", gameId), {
        playerB: user.uid,
        status: "active",
      });
    } catch (error) {
      console.error("Error accepting game:", error);
    }
  };

  const handleReject = async (gameId) => {
    try {
      await updateDoc(doc(db, "games", gameId), {
        status: "cancelled",
      });
    } catch (error) {
      console.error("Error rejecting game:", error);
    }
  };

  const displayList =
    scrollActive && games.length > 1 ? [...games, ...games] : games;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎯 Available Online Games</h2>

      {games.length === 0 ? (
        <p style={styles.empty}>No active games available right now 😴</p>
      ) : (
        <div className={`marquee-container-${id}`} style={styles.marqueeOuter}>
          <div
            ref={trackRef}
            className={`marquee-track-${id}`}
            style={{
              ...styles.track,
              animationPlayState:
                scrollActive && games.length > 1 ? "running" : "paused",
            }}
          >
            {displayList.map((game, i) => {
              const isCreator = game.playerA === user?.uid;
              const isOpponent = game.playerB === user?.uid;

              return (
                <div key={`${game.id}-${i}`} style={styles.card}>
                  <div style={styles.avatar}>{game.creator.avatar}</div>
                  <p style={styles.username}>{game.creator.username}</p>
                  <p style={styles.subjects}>
                    {Array.isArray(game.subjects)
                      ? game.subjects.join(", ")
                      : "—"}
                  </p>
                  <p style={styles.stake}>Stake: ₦{game.stake}</p>

                  <div style={styles.buttonBox}>
                    {isCreator ? (
                      <button
                        disabled
                        style={{
                          ...styles.btn,
                          background: "#777",
                          cursor: "not-allowed",
                        }}
                      >
                        Pending...
                      </button>
                    ) : (
                      <button
                        style={{ ...styles.btn, background: "#2e7d32" }}
                        onClick={() => handleAccept(game.id)}
                      >
                        Accept
                      </button>
                    )}

                    {isOpponent && (
                      <button
                        style={{ ...styles.btn, background: "#c62828" }}
                        onClick={() => handleReject(game.id)}
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
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
    width: "180px",
    background: "white",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  avatar: {
    fontSize: "36px",
    marginBottom: "4px",
  },
  username: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    margin: "2px 0 6px",
    textAlign: "center",
  },
  subjects: {
    fontSize: "12px",
    color: "#666",
    textAlign: "center",
    margin: "4px 0",
  },
  stake: {
    fontSize: "13px",
    color: "#1e88e5",
    fontWeight: "600",
    margin: "4px 0",
  },
  buttonBox: {
    display: "flex",
    gap: "6px",
    marginTop: "6px",
  },
  btn: {
    border: "none",
    color: "white",
    borderRadius: "6px",
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
  },
};
