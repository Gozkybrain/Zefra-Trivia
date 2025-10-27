"use client";

import { useEffect, useState } from "react";
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
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../components/AuthProvider";
import styles from "./AvailableGamesGrid.module.css";

export default function AvailableGamesGrid() {
    const { user } = useAuth();
    const router = useRouter();
    const [games, setGames] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

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
        // if accepted, send email to the playerA and move staked amount from both players to to escrow
        // if rejected, send email to playerA and return their funds back
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <h2 className={styles.title}>Available Games</h2>
            </div>

            {games.length === 0 ? (
                <p className={styles.empty}>No available games 😴</p>
            ) : (
                <div className={styles.grid}>
                    {games.map((game) => {
                        const isCreator = game.playerA === user?.uid;
                        const isOpponent = game.playerB === user?.uid;

                        const opponentName = isCreator
                            ? game.playerBData?.username || "Waiting..."
                            : game.playerAData?.username || "Unknown";

                        return (
                            <div key={game.id} className={styles.card}>
                                <div style={{ display: "flex", gap: 8 }}>
                                    {game.playerB ? (
                                        <>
                                            <span className={styles.avatar}>
                                                {game.playerAData.avatar}
                                            </span>
                                            <span>vs</span>
                                            <span className={styles.avatar}>
                                                {game.playerBData?.avatar || "👤"}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className={styles.avatar}>
                                                {game.playerAData.avatar}
                                            </span>
                                            <span>Waiting for Opponent</span>
                                        </>
                                    )}
                                </div>

                                <p className={styles.stake}>Stake: 🪙 {game.stake}</p>
                                <p className={styles.stake}>
                                    Opponent: {opponentName}
                                </p>

                                <div className={styles.buttonBox}>
                                    <button
                                        className={`${styles.btn} ${styles.btnView}`}
                                        onClick={() =>
                                            router.push(`/dashboard/game/${game.id}`)
                                        }
                                    >
                                        📁 Details
                                    </button>

                                    {game.status === "live" ? (
                                        <button
                                            className={`${styles.btn} ${styles.btnAccept}`}
                                            onClick={() =>
                                                router.push(`/dashboard/game/${game.id}`)
                                            }
                                        >
                                            ➤ Play Now
                                        </button>
                                    ) : game.status === "pending" ? (
                                        isCreator ? (
                                            <button
                                                disabled={loadingId === game.id}
                                                className={`${styles.btn} ${styles.btnReject}`}
                                                onClick={() =>
                                                    handleAction(
                                                        () =>
                                                            deleteDoc(
                                                                doc(db, "games", game.id)
                                                            ),
                                                        game.id
                                                    )
                                                }
                                            >
                                                {loadingId === game.id
                                                    ? "Deleting..."
                                                    : "✗ Delete"}
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    disabled={loadingId === game.id}
                                                    className={`${styles.btn} ${styles.btnAccept}`}
                                                    onClick={() =>
                                                        handleAction(
                                                            () =>
                                                                updateDoc(
                                                                    doc(db, "games", game.id),
                                                                    {
                                                                        playerB: user.uid,
                                                                        status: "live",
                                                                    }
                                                                ),
                                                            game.id,
                                                            true
                                                        )
                                                    }
                                                >
                                                    {loadingId === game.id
                                                        ? "Accepting..."
                                                        : `✓ Accept`}
                                                </button>

                                                <button
                                                    disabled={loadingId === game.id}
                                                    className={`${styles.btn} ${styles.btnReject}`}
                                                    onClick={() =>
                                                        handleAction(
                                                            () =>
                                                                deleteDoc(
                                                                    doc(db, "games", game.id)
                                                                ),
                                                            game.id
                                                        )
                                                    }
                                                >
                                                    {loadingId === game.id
                                                        ? "Rejecting..."
                                                        : `✗ Reject`}
                                                </button>
                                            </>
                                        )
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
