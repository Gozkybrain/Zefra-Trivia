"use client";

import ProtectedRoute from "../components/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute requireAuth={false}>
      <main>
        <h1>Welcome to Zefra Trivia 🎮</h1>
        <a href="/login">Login</a> | <a href="/register">Register</a>
      </main>
    </ProtectedRoute>
  );
}
