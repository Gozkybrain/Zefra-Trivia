"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ActiveUsersCarousel() {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    // Listen to all users currently online
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
    <div style={{ marginTop: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.7rem",
        }}
      >
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600 }}>Active Users</h2>
        <button
          style={{
            fontSize: "0.85rem",
            opacity: 0.7,
            cursor: "pointer",
            background: "none",
            border: "none",
            color: "inherit",
          }}
        >
          See all
        </button>
      </div>

      {activeUsers.length === 0 ? (
        <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>
          No active users right now 😴
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "12px",
            paddingBottom: "8px",
          }}
        >
          {activeUsers.map((user) => (
            <div
              key={user.id}
              style={{
                flex: "0 0 auto",
                textAlign: "center",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "10px",
                padding: "10px 8px",
                width: "100px",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  marginBottom: "4px",
                }}
              >
                {user.avatar || "👽"}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.username || "Anon"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
