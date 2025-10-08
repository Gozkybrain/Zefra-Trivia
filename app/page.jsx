'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import styles from './page.module.css';
import Link from "next/link";
import CurvedTitle from '../components/CurvedTitle';
import Loader from '@/components/Loader';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // Listen for auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch random 10 users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const q = query(collection(db, 'users'), limit(10));
        const snapshot = await getDocs(q);
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecentUsers(usersData);
      } catch (error) {
        console.error('🔥 Error fetching users:', error);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className={styles.containers}>
      <div className={styles.stars}></div>
      <div className={styles.starsSlow}></div>

      <div className={styles.glowOrb1}></div>
      <div className={styles.glowOrb2}></div>

      <div className={styles.mainContent}>
        <section className={styles.heroSection}>
          <div className={styles.heroInner}>
            <div className={styles.logoContainers}>
              <CurvedTitle />
            </div>

            <div className={styles.tagline}>
              {"Test Your Brain".split("").map((char, index) =>
                char === " " ? (
                  <span key={index} style={{ display: "inline-block", width: "12px" }} />
                ) : (
                  <span key={index} className={styles.char} style={{ animationDelay: `${index * 0.1}s` }}>
                    {char}
                  </span>
                )
              )}
              <br />
              <span className={styles.taglineGradient}>
                {"Play to Win.".split("").map((char, index) =>
                  char === " " ? (
                    <span key={index} style={{ display: "inline-block", width: "12px" }} />
                  ) : (
                    <span key={index} className={styles.charGradient} style={{ animationDelay: `${index * 0.1}s` }}>
                      {char}
                    </span>
                  )
                )}
              </span>
            </div>

            <div className={styles.buttonContainer}>
              <Link href="/download/iphone" className={styles.downloadBtn}>
                <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v13m0 0l-4-4m4 4l4-4M3 20h18" />
                </svg>
                Download for iPhone
              </Link>

              <Link href="/download/android" className={styles.downloadBtn}>
                <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" strokeWidth={2} />
                  <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth={2} strokeLinecap="round" />
                </svg>
                Download for Android
              </Link>

              {/* ✅ Dynamic button */}
              {user ? (
                <Link href="/dashboard" className={styles.downloadBtn}>
                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 12l2 2 4-4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 6l-4-4-4 4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 2v14" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Go to Dashboard
                </Link>
              ) : (
                <Link href="/login" className={styles.downloadBtn}>
                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                    <line x1="2" y1="12" x2="22" y2="12" strokeWidth={2} />
                    <path strokeWidth={2} d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  Use Web Version
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* ✅ Social Proof Section */}
        <section className={styles.socialProofSection}>
          <h3 className={styles.socialProofTitle}>Join the Trivib Community</h3>
          <div className={styles.carouselContainer}>
            {usersLoading ? (
              <div className={styles.usersLoader}><Loader /></div>
            ) : (
              <div className={styles.carousel}>
                {[...recentUsers, ...recentUsers, ...recentUsers].map((user, index) => (
                  <div key={index} className={styles.userCard}>
                    <div className={styles.userCardInner}>
                      <div className={styles.userAvatar}>
                        {user.avatar ? (
                          <span className={styles.avatarEmoji}>{user.avatar}</span>
                        ) : (
                          <div className={styles.avatarFallback}>
                            {(user.username || 'A')[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className={styles.userInfo}>
                        <p className={styles.userName}>{user.username || "Anonymous"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
