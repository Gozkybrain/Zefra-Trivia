"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useAuth } from "../../../../components/AuthProvider";
import Loader from "@/components/Loader";


export default function GamePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [game, setGame] = useState(null);
  const [playerA, setPlayerA] = useState(null);
  const [playerB, setPlayerB] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (authLoading || !id) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const gameRef = doc(db, "games", id);
        const gSnap = await getDoc(gameRef);
        if (!gSnap.exists()) {
          router.push("/dashboard");
          return;
        }

        const gData = { id: gSnap.id, ...gSnap.data() };
        setGame(gData);

        const playerAFetch = gData.playerA
          ? getDoc(doc(db, "users", gData.playerA)).catch(() => null)
          : null;
        const playerBFetch = gData.playerB
          ? getDoc(doc(db, "users", gData.playerB)).catch(() => null)
          : null;

        const [aSnap, bSnap] = await Promise.all([playerAFetch, playerBFetch]);

        if (aSnap && aSnap.exists()) {
          const a = aSnap.data();
          setPlayerA({
            uid: aSnap.id,
            username: a.username || a.displayName || "Player A",
            avatar: a.avatar || "👤",
          });
        }

        if (bSnap && bSnap.exists()) {
          const b = bSnap.data();
          setPlayerB({
            uid: bSnap.id,
            username: b.username || b.displayName || "Player B",
            avatar: b.avatar || "👤",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id, authLoading, router]);

  const doAction = async (action) => {
    if (!game || !user) return;
    setActionLoading(true);
    try {
      const ref = doc(db, "games", id);

      if (action === "accept") {
        await updateDoc(ref, { playerB: user.uid, status: "live" });
        router.push(`/play/${id}`);
      } else if (action === "decline") {
        await updateDoc(ref, { status: "rejected" });
        router.push("/dashboard");
      } else if (action === "cancel") {
        await updateDoc(ref, { status: "cancelled" });
        router.push("/dashboard");
      } else if (action === "play") {
        router.push(`/play/${id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading || loading)
    return (
      <div style={styles.container}>
        <Loader />
      </div>
    );

  if (!user)
    return (
      <div style={styles.container}>
        <p>You must be logged in to view this page.</p>
      </div>
    );

  if (!game)
    return (
      <div style={styles.container}>
        <p>Game not found or removed.</p>
      </div>
    );

  const isCreator = game.playerA === user.uid;
  const isPending = game.status === "pending";
  const isLive = game.status === "live";

  const playerAName = playerA?.username || "Player A";
  const playerBName = playerB?.username || (game.playerB ? "Opponent" : "Waiting...");

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎮 Game Details</h1>

      <div style={styles.card}>
        <div style={styles.section}>
          <div style={styles.label}>Player A</div>
          <div style={styles.infoLine}>
            <span style={styles.avatar}>{playerA?.avatar || "👤"}</span>
            <span style={styles.value}>{playerAName}</span>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.label}>Player B</div>
          <div style={styles.infoLine}>
            <span style={styles.avatar}>{playerB?.avatar || "👤"} </span>
            <span style={styles.value}>{playerBName}</span>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.label}>Stake</div>
          <div style={styles.value}>🪙 {game.stake}</div>
        </div>

        <div style={styles.section}>
          <div style={styles.label}>Subjects</div>
          <div style={styles.value}>
            {Array.isArray(game.subjects)
              ? game.subjects.join(", ")
              : game.subjects || "—"}
          </div>
        </div>


        <div style={styles.section}>
          <div style={styles.label}>Status</div>
          <div style={styles.value}>{game.status}</div>
        </div>

        <div style={styles.actions}>
          {isLive && (
            <button
              style={styles.playBtn}
              onClick={() => doAction("play")}
              disabled={actionLoading}
            >
              ▶️ Play Now
            </button>
          )}

          {isPending && isCreator && (
            <button
              style={styles.cancelBtn}
              onClick={() => doAction("cancel")}
              disabled={actionLoading}
            >
              Cancel Game
            </button>
          )}

          {isPending && !isCreator && (
            <>
              <button
                style={styles.acceptBtn}
                onClick={() => doAction("accept")}
                disabled={actionLoading}
              >
                Accept
              </button>
              <button
                style={styles.declineBtn}
                onClick={() => doAction("decline")}
                disabled={actionLoading}
              >
                Decline
              </button>
            </>
          )}

          {!isPending && !isLive && (
            <div style={styles.infoText}>This game is {game.status}.</div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "80vh",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "32px 16px",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: 20,
  },
  card: {
    width: "100%",
    maxWidth: 720,
    background: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    paddingBottom: 12,
  },
  label: {
    fontSize: 13,
    color: "#aaa",
  },
  infoLine: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  },
  value: {
    fontSize: 16,
    fontWeight: 600,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
    justifyContent: "flex-start",
  },
  playBtn: {
    background: "#2e7d31",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },
  acceptBtn: {
    background: "#43a047",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },
  declineBtn: {
    background: "#e53935",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },
  cancelBtn: {
    background: "#757575",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },
  infoText: { color: "#bbb", padding: "10px 0" },
};
