"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase"; // adjust as needed
import { useAuth } from "@/components/AuthProvider";
import style from "./login.module.css";
import styles from "../page.module.css";

const emojiOptions = ["👽", "🤖", "👾", "👻", "🧠", "🛸", "🎮", "🚀"];

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("👽");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const resetStates = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setError("");
    setMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, {
        displayName: username,
        photoURL: avatar,
      });
      router.push("/dashboard");
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent.");
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (err) => {
    if (err.code === "auth/email-already-in-use") {
      setError("Email already in use.");
    } else if (err.code === "auth/invalid-email") {
      setError("Invalid email.");
    } else if (err.code === "auth/weak-password") {
      setError("Password should be at least 6 characters.");
    } else if (err.code === "auth/user-not-found") {
      setError("User not found.");
    } else if (err.code === "auth/wrong-password") {
      setError("Incorrect password.");
    } else {
      setError("Something went wrong.");
    }
  };

  return (
    <div className={styles.container}>
      {/* Background Glow */}
      <div className={styles.stars}></div>
      <div className={styles.starsSlow}></div>
      <div className={styles.glowOrb1}></div>
      <div className={styles.glowOrb2}></div>

      {/* Auth Card */}
      <div className={styles.mainContent}>
        <div className={styles.heroSection}>
          <div className={styles.heroInner}>
            <div className={styles.alienContainer}>
              <div className={styles.alienGlow}>👾</div>
              <div className={styles.alien}>👾</div>
            </div>

            <h1 className={styles.logo}>Trivib</h1>
            <p className={styles.subtitle}>Log in. Sign up. Beam up.</p>

            <div className={styles.buttonContainer}>
              <button
                onClick={() => {
                  resetStates();
                  setActiveTab("login");
                }}
                className={styles.downloadBtn}
              >
                Login
              </button>
              <button
                onClick={() => {
                  resetStates();
                  setActiveTab("register");
                }}
                className={styles.downloadBtn}
              >
                Register
              </button>
              <button
                onClick={() => {
                  resetStates();
                  setActiveTab("forgot");
                }}
                className={styles.downloadBtn}
              >
                Forgot Password
              </button>
            </div>

            <form
              onSubmit={
                activeTab === "login"
                  ? handleLogin
                  : activeTab === "register"
                  ? handleRegister
                  : handleResetPassword
              }
              style={{ maxWidth: 400, margin: "0 auto" }}
            >
              {(activeTab === "register") && (
                <>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className={style.input}
                  />
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ color: "#fff", marginBottom: "8px", display: "block" }}>
                      Choose your alien:
                    </label>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                      {emojiOptions.map((e) => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => setAvatar(e)}
                          style={{
                            fontSize: "1.5rem",
                            padding: "6px",
                            borderRadius: "50%",
                            border: avatar === e ? "2px solid #22d3ee" : "1px solid #444",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={style.input}
              />
              {activeTab !== "forgot" && (
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={style.input}
                />
              )}

              <button
                type="submit"
                className={styles.downloadBtn}
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : activeTab === "login"
                  ? "Log In"
                  : activeTab === "register"
                  ? "Register"
                  : "Send Reset Link"}
              </button>

              {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
              {message && <p style={{ color: "lightgreen", marginTop: "1rem" }}>{message}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
