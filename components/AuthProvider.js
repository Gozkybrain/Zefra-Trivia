"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import useUserPresence from "@/hooks/useUserPresence";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Automatically handle online/offline status
  useUserPresence(user?.uid);

  useEffect(() => {
    // Watch for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const userRef = doc(db, "users", firebaseUser.uid);

      // Real-time listener for user profile
      const unsubscribeUser = onSnapshot(userRef, async (userSnap) => {
        let userData = userSnap.exists() ? userSnap.data() : {};

        try {
          // Fetch and compute live balance
          const txRef = collection(db, "transactions");
          const txQuery = query(txRef, where("userId", "==", firebaseUser.uid));
          const txSnap = await getDocs(txQuery);

          let balance = 0;
          txSnap.forEach((doc) => {
            const tx = doc.data();
            if (tx.type === "credit") balance += Number(tx.amount || 0);
            if (tx.type === "debit") balance -= Number(tx.amount || 0);
          });

          const mergedUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            ...userData,
            balance,
          };

          setUser(mergedUser);
        } catch (error) {
          console.error("🔥 Error fetching user or transactions:", error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...userData,
          });
        }

        setLoading(false);
      });

      return () => unsubscribeUser();
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
