'use client';

import { useState } from 'react';
import styles from './page.module.css';
import Link from "next/link";
import CurvedTitle from './CurvedTitle';


export default function Home() {
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
              {"Test Your Brain".split("").map((char, index) => {
                if (char === " ") {
                  return (
                    <span
                      key={index}
                      style={{ display: "inline-block", width: "12px" }}
                    />
                  );
                }
                return (
                  <span
                    key={index}
                    className={styles.char}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {char}
                  </span>
                );
              })}
              <br />
              <span className={styles.taglineGradient}>
                {"Play to Win.".split("").map((char, index) => {
                  if (char === " ") {
                    return (
                      <span
                        key={index}
                        style={{ display: "inline-block", width: "12px" }}
                      />
                    );
                  }
                  return (
                    <span
                      key={index}
                      className={styles.charGradient}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {char}
                    </span>
                  );
                })}
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

              <Link href="/login" className={styles.downloadBtn}>
                <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  <line x1="2" y1="12" x2="22" y2="12" strokeWidth={2} />
                  <path strokeWidth={2} d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                Use Web Version
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.socialProofSection}>
          <h3 className={styles.socialProofTitle}>Join the Trivib Community</h3>
          {/* <p className={styles.subtitle}>
              Challenge your knowledge and compete with players worldwide in this fun, fast-paced trivia games, and earn cash-backs too!
            </p> */}
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
    </div>
  );
}
