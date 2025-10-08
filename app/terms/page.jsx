'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./terms.module.css";

export default function TermsPage() {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const generatedBubbles = [...Array(15)].map(() => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${15 + Math.random() * 15}s`,
    }));
    setBubbles(generatedBubbles);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.bubbles}>
        {bubbles.map((style, i) => (
          <div key={i} className={styles.bubble} style={style} />
        ))}
      </div>

      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Terms & Conditions</h1>
          <p className={styles.subtitle}>
            Please read these terms carefully before using <strong>TriviB</strong>. By accessing or using our services, you agree to be bound by them.
          </p>
        </header>

        <div className={styles.termsContent}>
          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to <strong>TriviB</strong>, a peer-to-peer trivia and skill-based challenge platform developed by <strong>Zefra</strong>. These terms govern your use of our platform and services. By registering or using the platform, you fully accept these terms.
            </p>
          </section>

          <section>
            <h2>2. Eligibility</h2>
            <p>
              You must be at least <strong>18 years old</strong> to use TriviB. By creating an account, you confirm that you meet this requirement and that all information provided is accurate.
            </p>
          </section>

          <section>
            <h2>3. Account Registration & Security</h2>
            <p>
              You are required to register using a valid email and password. Social login options may be available. You are solely responsible for your account and all activity under it. TriviB is not liable for unauthorized access.
            </p>
          </section>

          <section>
            <h2>4. Token System</h2>
            <p>
              TriviB uses in-app tokens as its game currency. The conversion rate is <strong>₦1000 = 100 Tokens</strong>. Tokens can be used to enter matches and may be withdrawn as real cash, subject to our policies.
            </p>
          </section>

          <section>
            <h2>5. Game Modes</h2>
            <p>TriviB offers the following game modes:</p>
            <ul>
              <li><strong>Live 1v1:</strong> Real-time trivia duel with subject selection by both players.</li>
              <li><strong>Async 1v1:</strong> Turn-based mode. Player A plays first; Player B can join later. No expiry.</li>
              <li><strong>AI Mode:</strong> Player vs. AI. Tokens can be won if player beats AI.</li>
              <li><strong>Demo Mode:</strong> Free practice mode. No tokens or rewards. Ads may be shown.</li>
            </ul>
          </section>

          <section>
            <h2>6. Trivia & Question Generation</h2>
            <p>
              Trivia questions are dynamically generated using our AI. Each match contains 10 unique questions per player, based on selected subjects. Questions are temporary and deleted post-match; only metadata is retained.
            </p>
          </section>

          <section>
            <h2>7. Stakes, Escrow & Payouts</h2>
            <p>
              In paid modes, tokens staked by both players are locked in escrow during gameplay. Upon match completion:
            </p>
            <ul>
              <li>The winner receives <strong>90% of the total pot</strong>.</li>
              <li><strong>10%</strong> is retained as a platform fee by TriviB.</li>
            </ul>
            <p>
              All game outcomes are automatically calculated by our game engine and are final.
            </p>
          </section>

          <section>
            <h2>8. Deposits & Withdrawals</h2>
            <p>
              Deposits and withdrawals are processed via <strong>Paystack</strong>. Deposits are usually instant. Withdrawals may take up to <strong>48 business hours</strong>. We may verify your identity prior to processing large or flagged transactions.
            </p>
            <p>
              A processing fee may apply during withdrawals (up to 2%). You must ensure that your withdrawal details are correct.
            </p>
          </section>

          <section>
            <h2>9. Fair Play & Cheating</h2>
            <p>
              Cheating, collusion, bot usage, or any attempt to manipulate game outcomes is strictly prohibited. Such behavior will result in account suspension and possible forfeiture of funds. Legal action may be pursued in severe cases.
            </p>
          </section>

          <section>
            <h2>10. Leaderboard</h2>
            <p>
              TriviB maintains a global leaderboard showing top-performing players based on total tokens won, win rate, and subjects played. Leaderboard stats are for entertainment and recognition only.
            </p>
          </section>

          <section>
            <h2>11. Account Termination</h2>
            <p>
              We reserve the right to suspend or permanently disable any account found violating these terms or engaging in fraudulent activity. Tokens in such accounts may be withheld or forfeited.
            </p>
          </section>

          <section>
            <h2>12. Limitation of Liability</h2>
            <p>
              TriviB is provided "as is". We do not guarantee uninterrupted service or error-free gameplay. We are not liable for indirect losses, including but not limited to lost earnings, data, or access issues.
            </p>
          </section>

          <section>
            <h2>13. Updates to Terms</h2>
            <p>
              These terms may be updated periodically without prior notice. Continued use of the platform indicates your acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2>14. Contact</h2>
            <p>
              For support, legal concerns, or feedback, contact us at <a href="mailto:support@trivib.com" className={styles.link}>support@trivib.com</a>.
            </p>
          </section>
        </div>

        <div className={styles.ctaWrapper}>
          <Link href="/" className={styles.ctaButton}>
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
