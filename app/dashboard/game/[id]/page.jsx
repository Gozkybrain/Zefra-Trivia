"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase"; // ✅ Correct relative path
import { useAuth } from "../../../../components/AuthProvider"; // ✅ Corrected import

export default function GamePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch game once auth is ready
  useEffect(() => {
    if (authLoading || !id) return;

    const fetchGame = async () => {
      try {
        const gameRef = doc(db, "games", id);
        const snap = await getDoc(gameRef);

        if (!snap.exists()) {
          console.warn("Game not found.");
          router.push("/dashboard");
          return;
        }

        setGame({ id: snap.id, ...snap.data() });
      } catch (err) {
        console.error("Error loading game:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id, authLoading, router]);

  // ✅ Handle accept/reject actions
  const handleDecision = async (decision) => {
    try {
      const gameRef = doc(db, "games", id);

      if (decision === "accept") {
        await updateDoc(gameRef, {
          playerB: user.uid,
          status: "live",
        });
      } else {
        await updateDoc(gameRef, {
          status: "rejected",
        });
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Error updating game:", err);
    }
  };

  if (authLoading || loading) {
    return (
      <div style={styles.container}>
        <p>Loading game...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <p>You must be logged in to view this page.</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div style={styles.container}>
        <p>Game not found or removed.</p>
      </div>
    );
  }

  const isCreator = game.playerA === user.uid;
  const isOpponent = game.playerB === user.uid;
  const isPending = game.status === "pending";
  const isLive = game.status === "live";

  const canPlay = isLive && (isCreator || isOpponent);

  return (
    <div style={styles.container}>
      <h1>🎮 Game Room</h1>
      <p><b>Game ID:</b> {id}</p>
      <p><b>Type:</b> {game.type}</p>
      <p><b>Stake:</b> ₦{game.stake}</p>
      <p><b>Status:</b> {game.status}</p>

      {/* ✅ Dynamic game controls */}
      {canPlay ? (
        <button
          style={styles.playBtn}
          onClick={() => router.push(`/play/${id}`)}
        >
          Play Now
        </button>
      ) : isPending && isCreator ? (
        <p>Waiting for opponent to join...</p>
      ) : isPending && !isCreator ? (
        <div style={styles.actionButtons}>
          <button
            style={{ ...styles.actionBtn, background: "#43a047" }}
            onClick={() => handleDecision("accept")}
          >
            Accept {game.createdByName || "John Doe"}
          </button>
          <button
            style={{ ...styles.actionBtn, background: "#e53935" }}
            onClick={() => handleDecision("reject")}
          >
            Reject {game.createdByName || "John Doe"}
          </button>
        </div>
      ) : (
        <p>Game inactive.</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    color: "#fff",
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  playBtn: {
    background: "#1e88e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 16px",
    marginTop: "20px",
    cursor: "pointer",
    fontSize: "16px",
  },
  actionButtons: {
    display: "flex",
    gap: "15px",
    marginTop: "20px",
  },
  actionBtn: {
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 16px",
    cursor: "pointer",
    fontSize: "15px",
    transition: "0.3s",
  },
};
