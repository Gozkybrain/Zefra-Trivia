"use client";

import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "./Loader";

export default function ProtectedRoute({ children, requireAuth = true, redirectTo = "/login" }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.replace(redirectTo); // not logged in
      } else if (!requireAuth && user) {
        router.replace("/dashboard"); // already logged in
      }
    }
  }, [user, loading, requireAuth, redirectTo, router]);

  if (loading) return <Loader />;
  if ((requireAuth && !user) || (!requireAuth && user)) return null; // prevent flash

  return children;
}
