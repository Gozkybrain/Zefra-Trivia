'use client';

import { useEffect, useState } from 'react';
import styles from './android.module.css';

export default function AndroidDownloadPage() {
  const [isAndroid, setIsAndroid] = useState(false);
  const [isChrome, setIsChrome] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const android = /android/.test(userAgent);
    const chrome = /chrome/.test(userAgent) && !/edg/.test(userAgent);

    setIsAndroid(android);
    setIsChrome(chrome);

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (android && !isStandalone) {
      setIsInstallable(true);
    }

    setBubbles(
      Array.from({ length: 15 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 15 + Math.random() * 15
      }))
    );

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.bubbles}>
        {bubbles.map((bubble, i) => (
          <div key={i} className={styles.bubble} style={{
            left: `${bubble.left}%`,
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`
          }} />
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

        {!isAndroid ? (
          <div className={styles.warningCard}>
            <div className={styles.warningIcon}>⚠️</div>
            <p>This page is optimized for Android. Please visit from an Android device.</p>
          </div>
        ) : !isChrome ? (
          <div className={styles.warningCard}>
            <div className={styles.warningIcon}>🌐</div>
            <h3>Open in Chrome</h3>
            <p>To install Trivib, please open this page in Chrome browser for the best experience.</p>
            <ol className={styles.chromeSteps}>
              <li>Tap the three dots menu</li>
              <li>Select "Open in Chrome"</li>
              <li>Return to this page</li>
            </ol>
          </div>
        ) : (
          <>
            <div className={styles.readyCard}>
              <div className={styles.checkIcon}>✓</div>
              <h3>Ready to Install</h3>
              <p>Install Trivib directly to your home screen</p>
            </div>

            {deferredPrompt ? (
              <button className={styles.ctaButton} onClick={handleInstallClick}>
                <span className={styles.ctaGlow}></span>
                <span className={styles.ctaText}>Install Now</span>
              </button>
            ) : (
              <>
                <div className={styles.steps}>
                  <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                      <div className={styles.stepIcon}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="5" r="1" fill="currentColor"/>
                          <circle cx="12" cy="12" r="1" fill="currentColor"/>
                          <circle cx="12" cy="19" r="1" fill="currentColor"/>
                        </svg>
                      </div>
                      <div>
                        <h4>Tap the Menu Button</h4>
                        <p>Look for the three dots in the top right corner</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                      <div className={styles.stepIcon}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                          <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div>
                        <h4>Select "Add to Home Screen"</h4>
                        <p>Or "Install App" if available</p>
                      </div>
                    </div>
                  </div>

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
                        <p>Tap "Install" or "Add" to complete</p>
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
