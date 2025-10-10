"use client";
import { useEffect } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function useUserPresence(userId) {
  useEffect(() => {
    if (!userId) return;

    const userRef = doc(db, "users", userId);

    // mark online immediately
    updateDoc(userRef, {
      isOnline: true,
      lastActive: serverTimestamp(),
    });

    // refresh activity every minute
    const interval = setInterval(() => {
      updateDoc(userRef, {
        isOnline: true,
        lastActive: serverTimestamp(),
      });
    }, 60_000); // 60s

    // mark offline when tab closes
    const handleBeforeUnload = async () => {
      await updateDoc(userRef, { isOnline: false });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      updateDoc(userRef, { isOnline: false });
    };
  }, [userId]);
}
