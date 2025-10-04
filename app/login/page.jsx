"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import style from "./login.module.css";
import styles from "../page.module.css";
import CurvedTitle from "../CurvedTitle";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";


const emojiOptions = ["👽", "👨‍🚀", "🥷", "🧙‍♂️", "🕵️‍♀️", "🧛‍♂️", "🧚‍♀️", "🦸‍♂️"];

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("👽");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  // * Recent or Top Users will be fixed with firebase later
  const [recentUsers] = useState([
    { name: 'Alex', role: 'Pro', avatar: '👨‍🚀' },
    { name: 'Sofia', role: 'New', avatar: '🥷' },
    { name: 'Kenji', role: 'Top Player', avatar: '🧙‍♂️' },
    { name: 'Emma', role: 'Veteran', avatar: '🕵️‍♀️' },
    { name: 'Liam', role: 'Champion', avatar: '🧛‍♂️' },
    { name: 'Zara', role: 'Pro', avatar: '🧚‍♀️' },
    { name: 'Carlos', role: 'New', avatar: '🦸‍♂️' },
    { name: 'Nina', role: 'Top Player', avatar: '🧟‍♀️' },
    { name: 'Maya', role: 'Rookie', avatar: '🧜‍♀️' },
    { name: 'Tom', role: 'Legend', avatar: '🤖' },
    { name: 'Dan', role: 'Geek', avatar: '👽' },
  ]);

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


  // * handle login function
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


  // * handle registration function
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Create the user with email/password
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // 2. Update Auth profile (for UI purposes)
      await updateProfile(user, {
        displayName: username,
        photoURL: avatar,
      });

      // 3. Store user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: username,
        avatar: avatar,
        createdAt: new Date(),
        role: "user",
      });

      // 4. Redirect
      router.push("/dashboard");
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
    // * Update with Logic to send welcome email with nodemailer
  };


  // * handle reset password logic
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

  // * handle errors from authentication
  const handleAuthError = (err) => {
    const code = err?.code?.toLowerCase() || "";

    if (code.includes("email-already-in-use")) {
      setError("Email already in use.");
    } else if (code.includes("invalid-email")) {
      setError("Invalid email address.");
    } else if (code.includes("weak-password")) {
      setError("Password should be at least 6 characters.");
    } else if (code.includes("user-not-found")) {
      setError("No account found with this email.");
    } else if (code.includes("wrong-password")) {
      setError("Incorrect password.");
    } else if (code.includes("too-many-requests")) {
      setError("Too many login attempts. Try again later.");
    } else {
      setError("Error: Please check details and try again.");
    }
  };


  return (
    <div className={styles.containers}>
      {/* Background Glow */}
      <div className={styles.stars}></div>
      <div className={styles.starsSlow}></div>
      <div className={styles.glowOrb1}></div>
      <div className={styles.glowOrb2}></div>

      {/* Auth Card */}
      <div className={styles.mainContent}>
        <div className={styles.heroSection}>
          <div className={styles.heroInner}>

            <CurvedTitle />
            <div className={styles.tagline}>
              <p className={styles.taglineGradient}>Ready to Trivia?</p>
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

              <label htmlFor="">Email Address:</label>
              <input
                type="email"
                placeholder="johndoe@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={style.input}
              />


              {activeTab !== "forgot" && (
                // * hide if forgot password is active
                <>
                  <label htmlFor="">Password:</label>
                  <input
                    type="password"
                    placeholder="**********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={style.input}
                  />
                </>
              )}


              {(activeTab === "register") && (
                // * show when register tab is active
                <>
                  <label htmlFor="">Username:</label>
                  <input
                    type="text"
                    placeholder="eg. Zefra4real"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className={style.input}
                  />

                  <div style={{ marginBottom: "1rem" }}>
                    <label>
                      Choose your alien:
                    </label>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "1rem" }}>
                      {emojiOptions.map((e) => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => setAvatar(e)}
                          style={{
                            fontSize: "1.5rem",
                            padding: "6px",
                            borderRadius: "10%",
                            border: avatar === e ? "2px solid #22d3ee" : "1px solid #444 ",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                    <Link href="/terms" className={style.link}>
                      I agree to the terms and conditions
                    </Link>
                  </div>
                </>
              )}

              <button
                type="submit"
                className={`${styles.downloadBtn} ${style.submitBtn}`}
                disabled={loading}
              >
                {loading
                  // * Switch button based on active tab
                  ? "Please wait..."
                  : activeTab === "login"
                    ? "Log In Account"
                    : activeTab === "register"
                      ? "Register an Account"
                      : "Send Reset Link"}
              </button>

              {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
              {message && <p style={{ color: "lightgreen", marginTop: "1rem" }}>{message}</p>}


              <div className={style.btnContainer}>
                {activeTab !== "login" && (
                  // * login tab selection
                  <button
                    onClick={() => {
                      resetStates();
                      setActiveTab("login");
                    }}
                    className={styles.downloadBtn}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ marginRight: "8px" }}>
                      <path d="M16 21v-2a4 4 0 0 0-8 0v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Login
                  </button>
                )}
                {activeTab !== "register" && (
                  // * registration tab selection
                  <button
                    onClick={() => {
                      resetStates();
                      setActiveTab("register");
                    }}
                    className={styles.downloadBtn}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ marginRight: "8px" }}>
                      <circle cx="12" cy="7" r="4" />
                      <path d="M16 21v-2a4 4 0 0 0-8 0v2" />
                      <line x1="18" y1="8" x2="24" y2="8" />
                      <line x1="21" y1="5" x2="21" y2="11" />
                    </svg>
                    Register
                  </button>
                )}
                {activeTab !== "forgot" && (
                  // * forgot password tab selection
                  <button
                    onClick={() => {
                      resetStates();
                      setActiveTab("forgot");
                    }}
                    className={styles.downloadBtn}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ marginRight: "8px" }}>
                      <circle cx="15" cy="15" r="4" />
                      <path d="M10 14v-4h4" />
                      <line x1="10" y1="10" x2="14" y2="6" />
                    </svg>
                    Forgot Pass?
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>
      </div>

      <section className={styles.socialProofSection}>
        <h3 className={styles.socialProofTitle}>Join the Trivib Community</h3>
        <div className={styles.carouselContainer}>
          <div className={styles.carousel}>
            {[...recentUsers, ...recentUsers].map((user, index) => (
              <div key={index} className={styles.userCard}>
                <div className={styles.userCardInner}>
                  <div className={styles.userAvatar}>{user.avatar}</div>
                  <div className={styles.userInfo}>
                    <p className={styles.userName}>
                      {user.name}
                    </p>
                    <p className={styles.userRole}>{user.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
