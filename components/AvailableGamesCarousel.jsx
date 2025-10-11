"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthProvider";
import styles from "../styles/AvailableGamesCarousel.module.css";


export default function AvailableGamesCarousel() {
    const { user } = useAuth();
    const router = useRouter();
    const [games, setGames] = useState([]);
    const [scrollActive, setScrollActive] = useState(false);
    const [loadingId, setLoadingId] = useState(null);
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const uidRef = useRef(Math.random().toString(36).substring(2, 9));
    const id = uidRef.current;
    const styleElRef = useRef(null);

    // * Fetch games (online or p2p, pending/live)
    useEffect(() => {
        const q = query(
            collection(db, "games"),
            where("type", "in", ["online", "p2p"]),
            where("status", "in", ["pending", "live"])
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const gameList = await Promise.all(
                snapshot.docs.map(async (docSnap) => {
                    const data = docSnap.data();

                    let playerAData = { username: "Unknown", avatar: "🎮" };
                    let playerBData = null;

                    if (data.playerA) {
                        try {
                            const userDoc = await getDoc(doc(db, "users", data.playerA));
                            if (userDoc.exists()) {
                                const u = userDoc.data();
                                playerAData = {
                                    username: u.username || u.displayName || "Unknown",
                                    avatar: u.avatar || "👤",
                                };
                            }
                        } catch (e) {
                            console.warn("Error fetching playerA:", e);
                        }
                    }

                    if (data.playerB) {
                        try {
                            const userDoc = await getDoc(doc(db, "users", data.playerB));
                            if (userDoc.exists()) {
                                const u = userDoc.data();
                                playerBData = {
                                    username: u.username || u.displayName || "Unknown",
                                    avatar: u.avatar || "👤",
                                };
                            }
                        } catch (e) {
                            console.warn("Error fetching playerB:", e);
                        }
                    }

                    return { id: docSnap.id, ...data, playerAData, playerBData };
                })
            );

            const filteredGames = gameList.filter((g) => {
                const isCreator = g.playerA === user?.uid;
                const isOpponent = g.playerB === user?.uid;
                const isWaiting = !g.playerB;
                return isCreator || isOpponent || isWaiting;
            });

            setGames(filteredGames);
        });

        return () => unsubscribe();
    }, [user]);

    // * Auto scroll setup
    useEffect(() => {
        const removeStyle = () => {
            if (styleElRef.current) {
                styleElRef.current.remove();
                styleElRef.current = null;
            } else {
                const existing = document.getElementById(`marquee-style-${id}`);
                if (existing) existing.remove();
            }
        };

        const measure = () => {
            const container = containerRef.current;
            const track = trackRef.current;
            if (!container || !track) return;

            const children = Array.from(track.children);
            if (children.length === 0) return;

            const originalCount = games.length || 1;
            let singleWidth = 0;
            for (let i = 0; i < Math.min(originalCount, children.length); i++) {
                singleWidth +=
                    children[i].getBoundingClientRect().width +
                    parseFloat(getComputedStyle(children[i]).marginRight || 0);
            }

            const containerWidth = container.clientWidth;
            const shouldScroll = singleWidth > containerWidth + 8;
            setScrollActive(shouldScroll);

            removeStyle();

            if (shouldScroll && singleWidth > 0) {
                const durationSeconds = Math.max(8, Math.round(singleWidth / 60));
                const css = `
          .marquee-container-${id} { overflow: hidden; position: relative; width: 100%; }
          .marquee-track-${id} { display: flex; gap: 12px; align-items: stretch; will-change: transform; animation: marquee-${id} ${durationSeconds}s linear infinite; }
          @keyframes marquee-${id} { 0% { transform: translateX(0); } 100% { transform: translateX(-${singleWidth}px); } }
          .marquee-container-${id}:hover .marquee-track-${id} { animation-play-state: paused; }
          .marquee-container-${id}::-webkit-scrollbar { display: none; }
          .marquee-container-${id} { -ms-overflow-style: none; scrollbar-width: none; }
        `;
                const styleEl = document.createElement("style");
                styleEl.id = `marquee-style-${id}`;
                styleEl.appendChild(document.createTextNode(css));
                document.head.appendChild(styleEl);
                styleElRef.current = styleEl;
            } else {
                removeStyle();
            }
        };

        const t = setTimeout(measure, 80);
        window.addEventListener("resize", measure);
        return () => {
            clearTimeout(t);
            window.removeEventListener("resize", measure);
            removeStyle();
        };
    }, [games, id]);

    // * Game actions
    const handleAction = async (callback, gameId, redirect = false) => {
        setLoadingId(gameId);
        try {
            await callback();
            if (redirect) router.push(`/dashboard/game/${gameId}`);
            else window.location.reload();
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingId(null);
        }
        // * Update with email for accept or decline
    };

    const displayList =
        scrollActive && games.length > 1 ? [...games, ...games] : games;

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <h2 className={styles.title}>Available Games</h2>
                <a href="/dashboard/play" className={styles.link}>
                    See all
                </a>
            </div>

            {games.length === 0 ? (
                <p className={styles.empty}>No available games 😴</p>
            ) : (
                <div
                    ref={containerRef}
                    className={`marquee-container-${id} ${styles.marqueeOuter}`}
                >
                    <div
                        ref={trackRef}
                        className={`marquee-track-${id} ${styles.track}`}
                        onMouseEnter={() => {
                            const el = trackRef.current;
                            if (el) el.style.animationPlayState = "paused";
                        }}
                        onMouseLeave={() => {
                            const el = trackRef.current;
                            if (el) el.style.animationPlayState = "running";
                        }}
                    >
                        {displayList.map((game, i) => {
                            const isCreator = game.playerA === user?.uid;
                            // const isOpponent = game.playerB === user?.uid;

                            return (
                                <div key={`${game.id}-${i}`} className={styles.card}>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        {game.playerB ? (
                                            <>
                                                <span className={styles.avatar}>{game.playerAData.avatar}</span>
                                                <span>vs</span>
                                                <span className={styles.avatar}>{game.playerBData?.avatar || "👤"}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>{game.playerAData.avatar}</span>
                                                <span>Waiting for Opponent</span>
                                            </>
                                        )}
                                    </div>

                                    <p className={styles.subjects}>
                                        {Array.isArray(game.subjects)
                                            ? game.subjects.join(", ")
                                            : "—"}
                                    </p>
                                    <p className={styles.stake}>Stake: 🪙 {game.stake}</p>

                                    <div className={styles.buttonBox}>
                                        {game.status === "live" ? (
                                            //  Show Play Now for both players if game is live
                                            <button
                                                className={`${styles.btn} ${styles.btnAccept}`}
                                                onClick={() => router.push(`/dashboard/game/${game.id}`)}
                                            >
                                               ➤ Play Now
                                            </button>
                                        ) : game.status === "pending" ? (
                                            //  If game is still pending
                                            isCreator ? (
                                                // If you're the creator, you can delete it
                                                <button
                                                    disabled={loadingId === game.id}
                                                    className={`${styles.btn} ${styles.btnReject}`}
                                                    onClick={() =>
                                                        handleAction(() => deleteDoc(doc(db, "games", game.id)), game.id)
                                                    }
                                                >
                                                    {loadingId === game.id ? "Deleting..." : "✗ Delete"}
                                                </button>
                                            ) : (
                                                // If you're not the creator (potential opponent)
                                                <>
                                                    <button
                                                        disabled={loadingId === game.id}
                                                        className={`${styles.btn} ${styles.btnAccept}`}
                                                        onClick={() =>
                                                            handleAction(
                                                                () =>
                                                                    updateDoc(doc(db, "games", game.id), {
                                                                        playerB: user.uid,
                                                                        status: "live",
                                                                    }),
                                                                game.id,
                                                                true // redirect after accept
                                                            )
                                                        }
                                                    >
                                                        {loadingId === game.id
                                                            ? "Accepting..."
                                                            : `✓  ${game.playerAData.username}`}
                                                    </button>

                                                    <button
                                                        disabled={loadingId === game.id}
                                                        className={`${styles.btn} ${styles.btnReject}`}
                                                        onClick={() =>
                                                            handleAction(() => deleteDoc(doc(db, "games", game.id)), game.id)
                                                        }
                                                    >
                                                        {loadingId === game.id
                                                            ? "Rejecting..."
                                                            : `✗  ${game.playerAData.username}`}
                                                    </button>
                                                </>
                                            )
                                        ) : null}
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
