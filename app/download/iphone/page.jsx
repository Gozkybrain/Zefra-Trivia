'use client';

import { useEffect, useState } from 'react';
import styles from './iphone.module.css';

export default function IPhoneDownloadPage() {
  const [isIOS, setIsIOS] = useState(false);
  const [isInSafari, setIsInSafari] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [bubbles, setBubbles] = useState([]);

  // Detect iOS, Safari, and if app is installable
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iOS = /iphone|ipad|ipod/.test(userAgent);
    const safari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone;

    setIsIOS(iOS);
    setIsInSafari(safari);

    if (iOS && safari && !isStandalone) {
      setIsInstallable(true);
    }

    // Generate random bubble styles only on client to avoid hydration mismatch
    const generatedBubbles = [...Array(15)].map(() => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${15 + Math.random() * 15}s`,
    }));
    setBubbles(generatedBubbles);
  }, []);

  const handleInstallClick = () => {
    if (isInstallable) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.bubbles}>
        {bubbles.map((style, i) => (
          <div key={i} className={styles.bubble} style={style} />
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.hero}>
          <div className={styles.glowOrb}></div>
          <h1 className={styles.title}>
            <span className={styles.gradient}>Trivib</span>
          </h1>
          <p className={styles.subtitle}>Experience the future of trivia gaming</p>
        </div>

        {!isIOS ? (
          <div className={styles.warningCard}>
            <div className={styles.warningIcon}>⚠️</div>
            <p>This page is optimized for iPhone. Please visit from an iOS device.</p>
          </div>
        ) : !isInSafari ? (
          <div className={styles.warningCard}>
            <div className={styles.warningIcon}>🧭</div>
            <h3>Open in Safari</h3>
            <p>To install Trivib, please open this page in Safari browser.</p>
            <ol className={styles.safariSteps}>
              <li>Tap the Share button in your browser</li>
              <li>Select "Open in Safari"</li>
              <li>Return to this page</li>
            </ol>
          </div>
        ) : (
          <>
            <div className={styles.readyCard}>
              <div className={styles.checkIcon}>✓</div>
              <h3>Ready to Install</h3>
              <p>Follow the steps below to add Trivib to your home screen</p>
            </div>

            <div className={styles.steps}>
              {/* Step 1 */}
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Tap the Share Button</h4>
                    <p>Look for the share icon at the bottom of Safari</p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M4 12h16M12 4v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <rect x="3" y="12" width="18" height="9" rx="2" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Scroll & Find "Add to Home Screen"</h4>
                    <p>Scroll down the menu and tap this option</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M9 11l3 3 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Confirm Installation</h4>
                    <p>Tap "Add" in the top right corner to complete</p>
                  </div>
                </div>
              </div>
            </div>

            <button className={styles.ctaButton} onClick={handleInstallClick}>
              <span className={styles.ctaGlow}></span>
              <span className={styles.ctaText}>Start Installation</span>
            </button>
          </>
        )}

        <div className={styles.illustration}>
          <div className={styles.phone}>
            <div className={styles.phoneScreen}>
              <div className={styles.appIcon}>T</div>
              <div className={styles.scanLines}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
