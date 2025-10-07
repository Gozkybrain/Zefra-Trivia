'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./terms.module.css";

export default function TermsPage() {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    // Generate random bubble styles only on client to avoid hydration mismatch
    const generatedBubbles = [...Array(15)].map(() => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${15 + Math.random() * 15}s`,
    }));
    setBubbles(generatedBubbles);
  }, []);


  return (
    <div className={styles.wrapper}>
      {/* Floating Bubbles */}
      <div className={styles.bubbles}>
        {bubbles.map((style, i) => (
          <div key={i} className={styles.bubble} style={style} />
        ))}
      </div>

      <div className={styles.container}>
        {/* Hero */}
        <header className={styles.hero}>
          <h1 className={styles.title}> Terms & Conditions</h1>
          <p className={styles.subtitle}>
            Please read these terms carefully before using <strong>Trivib</strong>.
            By accessing or using our services, you agree to be bound by them.
          </p>
        </header>

        {/* Terms Content */}
        <div className={styles.termsContent}>
          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to <strong>Trivib</strong>, an online trivia and challenge platform promoted by <strong>Zefra</strong>.
              These terms govern your access to and use of our website, services, and games.
              By creating an account or using any part of the service, you agree to these terms in full.
            </p>
          </section>

          <section>
            <h2>2. Eligibility</h2>
            <p>
              You must be at least <strong>18 years old</strong> to register and participate on Trivib.
              By signing up, you represent that you meet this requirement and that the information you provide is accurate and complete.
            </p>
          </section>

          <section>
            <h2>3. Account Registration & Responsibility</h2>
            <p>
              Users must create an account with a valid email and password.
              You are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account.
              Trivib is not liable for losses resulting from unauthorized access to your account.
            </p>
          </section>

          <section>
            <h2>4. Gameplay Rules</h2>
            <p>
              Trivib hosts real-time trivia and skill-based challenges. Game results are determined by an automated system and are final.
              Any attempt to cheat, use bots, manipulate scores, or collude with others will result in immediate suspension and possible legal action.
            </p>
          </section>

          <section>
            <h2>5. Fees & Commission</h2>
            <p>
              Trivib charges a small commission on each match played. The breakdown is as follows:
            </p>
            <ul>
              <li><strong>Platform Commission:</strong> 5% of total stake.</li>
              <li><strong>Service/Processing Fee:</strong> 1% (varies by payment method).</li>
              <li><strong>Payout:</strong> 94% to the winning player.</li>
            </ul>
            <p>
              For example, if two players each stake ₦1,000 (₦2,000 total), ₦120 is deducted as fees and ₦1,880 is awarded to the winner.
            </p>
          </section>

          <section>
            <h2>6. Deposits & Withdrawals</h2>
            <p>
              Deposits are typically processed instantly but may be subject to delays from financial institutions. Withdrawals are processed within 24–72 hours on business days.
              A withdrawal fee of up to 2% may apply. Trivib reserves the right to verify user identity before releasing funds.
            </p>
          </section>

          <section>
            <h2>7. Disputes & Game Results</h2>
            <p>
              Game outcomes determined by Trivib’s automated system are final. Any disputes must be reported within 24 hours. Our decision on such disputes is final and binding.
            </p>
          </section>

          <section>
            <h2>8. Account Suspension & Termination</h2>
            <p>
              We may suspend or terminate accounts involved in fraud, abuse, or violations of these terms.
              Any remaining balance or pending winnings in such accounts may be forfeited.
            </p>
          </section>

          <section>
            <h2>9. Limitation of Liability</h2>
            <p>
              Trivib is provided “as is” and without warranties of any kind. We are not liable for indirect, incidental, or consequential damages including lost earnings, service interruptions, or data loss.
            </p>
          </section>

          <section>
            <h2>10. Updates to These Terms</h2>
            <p>
              We may update these terms at any time without prior notice. Continued use of the platform after changes constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2>11. Contact</h2>
            <p>
              For support, disputes, or legal concerns, contact us at <a href="mailto:support@trivib.com" className={styles.link}>support@trivib.com</a>.
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
