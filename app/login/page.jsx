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
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import style from "./login.module.css";
import styles from "../page.module.css";
import CurvedTitle from "../../components/CurvedTitle";
import { doc, setDoc, collection, getDocs, query, limit } from "firebase/firestore";
import Loader from "@/components/Loader";


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

  const [recentUsers, setRecentUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const { user } = useAuth();
  const router = useRouter();

  // Redirect if logged in
  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  // Fetch dynamic users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const q = query(collection(db, "users"), limit(20));
        const snapshot = await getDocs(q);
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecentUsers(usersData);
      } catch (error) {
        console.error("🔥 Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

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
      // 1️⃣ Create user in Firebase Auth
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // 2️⃣ Update their profile (for display name & avatar)
      await updateProfile(user, {
        displayName: username,
        photoURL: avatar || "👽",
      });

      // 3️⃣ Save user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username,
        avatar: avatar || "👽",
        createdAt: new Date(),
        role: "user",
      });

      // 4️⃣ Trigger welcome + admin emails
      try {
        const res = await fetch("/api/sendEmails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email: user.email }),
        });

        // safer parse: read raw response in case it's not valid JSON
        const raw = await res.text();
        let data;
        try {
          data = JSON.parse(raw);
        } catch (err) {
          throw new Error(`Invalid JSON response from email API: ${raw}`);
        }

        if (data.ok) {
          console.log("📨 Emails sent successfully!");
        } else {
          console.error("❌ Email sending failed:", data?.error || "Unknown error");
        }
      } catch (err) {
        console.error("❌ Failed to trigger email API:", err.message || err);
      }

      // 5️⃣ Redirect to dashboard
      await router.push("/dashboard");

    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
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
    if (code.includes("email-already-in-use")) setError("Email already in use.");
    else if (code.includes("invalid-email")) setError("Invalid email address.");
    else if (code.includes("weak-password")) setError("Password should be at least 6 characters.");
    else if (code.includes("user-not-found")) setError("No account found with this email.");
    else if (code.includes("wrong-password")) setError("Incorrect password.");
    else if (code.includes("too-many-requests")) setError("Too many login attempts. Try again later.");
    else setError("Error: Please check details and try again.");
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
              <label>Email Address:</label>
              <input
                type="email"
                placeholder="johndoe@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={style.input}
              />

              {activeTab !== "forgot" && (
                <>
                  <label>Password:</label>
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

              {activeTab === "register" && (
                <>
                  <label>Username:</label>
                  <input
                    type="text"
                    placeholder="eg. Zefra4real"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className={style.input}
                  />

                  <div style={{ marginBottom: "1rem" }}>
                    <label>Choose your alien:</label>
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
                  <button
                    onClick={() => {
                      resetStates();
                      setActiveTab("login");
                    }}
                    className={styles.downloadBtn}
                  >
                    Login
                  </button>
                )}
                {activeTab !== "register" && (
                  <button
                    onClick={() => {
                      resetStates();
                      setActiveTab("register");
                    }}
                    className={styles.downloadBtn}
                  >
                    Register
                  </button>
                )}
                {activeTab !== "forgot" && (
                  <button
                    onClick={() => {
                      resetStates();
                      setActiveTab("forgot");
                    }}
                    className={styles.downloadBtn}
                  >
                    Forgot Pass?
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ✅ Dynamic Infinite Scroll Section */}
      <section className={styles.socialProofSection}>
        <h3 className={styles.socialProofTitle}>Join the Trivib Community</h3>
        <div className={styles.carouselContainer}>
          {loadingUsers ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <Loader />
            </div>
          ) : (
            <div className={styles.carousel}>
              {[...recentUsers, ...recentUsers].map((u, i) => (
                <div key={i} className={styles.userCard}>
                  <div className={styles.userCardInner}>
                    <div className={styles.userAvatar}>{u.avatar || "👽"}</div>
                    <div className={styles.userInfo}>
                      <p className={styles.userName}>{u.username || "Anonymous"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
