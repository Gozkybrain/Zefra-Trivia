'use client';

import { useEffect, useState } from 'react';
import styles from './android.module.css';
import CurvedTitle from '@/components/CurvedTitle';


export default function AndroidDownloadPage() {
  const [isAndroid, setIsAndroid] = useState(false);
  const [isChrome, setIsChrome] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [bubbles, setBubbles] = useState([]);

  // Detect Andriod, Chrome, and if app is installable
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const android = /android/.test(userAgent);
    const chrome = /chrome/.test(userAgent) && !/edg/.test(userAgent);

    setIsAndroid(android);
    setIsChrome(chrome);

    // Generate random bubble styles only on client to avoid hydration mismatch
    setBubbles(
      Array.from({ length: 15 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 15 + Math.random() * 15
      }))
    );

    // Handle the 'beforeinstallprompt' event before the browser shows the install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // handle the install button (scroll)
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
    <div className={styles.containers}>
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
          <CurvedTitle />
          <p className={styles.subtitle}>Experience the future of trivia gaming</p>
        </div>

        {!isAndroid ? (
          // * Show if device is not an andriod
          <div className={styles.warningCard}>
            <div className={styles.warningIcon}>⚠️</div>
            <p>This page is optimized for Android. Please visit from an Android device.</p>
          </div>
        ) : !isChrome ? (
          // * show if browser is not chrome on an android
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
          // * show if device is android and browser is chrome
          <>
            <div className={styles.readyCard}>
              <div className={styles.checkIcon}>✓</div>
              <h3>Ready to Install</h3>
              <p>Install Trivib directly to your home screen</p>
            </div>

            {deferredPrompt ? (
              // * show if the app exists and is installable
              <button className={styles.ctaButton} onClick={handleInstallClick}>
                <span className={styles.ctaGlow}></span>
                <span className={styles.ctaText}>Install Now</span>
              </button>
            ) : (
              // * show manual step to install
              <>
                <div className={styles.steps}>
                  <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                      <div className={styles.stepIcon}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="5" r="1" fill="currentColor" />
                          <circle cx="12" cy="12" r="1" fill="currentColor" />
                          <circle cx="12" cy="19" r="1" fill="currentColor" />
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
                          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                          <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
                          <path d="M9 11l3 3 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
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

        {/* extra for fancy */}
        <div className={styles.illustration}>
          <div className={styles.phone}>
            <div className={styles.phoneScreen}>
              <div className={styles.appIcon}>👽</div>
              <div className={styles.scanLines}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
