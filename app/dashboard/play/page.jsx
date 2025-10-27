"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Loader from "@/components/Loader";

export default function PlayPage() {
  const params = useSearchParams();
  const opponentId = params.get("opponentId");

  const [opponent, setOpponent] = useState(null);
  const [loading, setLoading] = useState(!!opponentId);

  useEffect(() => {
    if (!opponentId) return;

    const fetchOpponent = async () => {
      try {
        const ref = doc(db, "users", opponentId);
        const snap = await getDoc(ref);
        if (snap.exists()) setOpponent(snap.data());
      } catch (err) {
        console.error("Error fetching opponent:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpponent();
  }, [opponentId]);

  if (loading) return <Loader />;

  return (
    <div className="p-6 text-center">
      {opponentId ? (
        opponent ? (
          <h2>
            🎮 You want to play a game with{" "}
            <span className="font-semibold">{opponent.username || "Unknown Player"}</span>
          </h2>
        ) : (
          <p>Opponent not found 😕</p>
        )
      ) : (
        <h2>🤔 Who do you want to play with?</h2>
      )}
    </div>
  );
}
