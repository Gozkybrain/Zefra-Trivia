'use client';

import React, { useState, useEffect } from 'react';
import styles from './CurvedText.module.css';

export default function CurvedTitle() {
  const [floatOffset, setFloatOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFloatOffset((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const floatY = Math.sin(floatOffset * 0.05) * 12;

  return (
    <div className={styles.wrapper}>
      <svg viewBox="0 10 800 200" width="100%" height="200" style={{ overflow: 'visible' }}>
        <defs>
          <path
            id="trivib-curve"
            d="M 50 180 A 600 600 0 0 1 750 180"
            fill="transparent"
          />
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b58546" />
            <stop offset="50%" stopColor="#d4a74f" />
            <stop offset="100%" stopColor="#f5c06b" />
          </linearGradient>
        </defs>

        {/* TRIVIB on the curve */}
        <text
          fontSize="190"
          fontWeight="1000"
          letterSpacing="5"
          textAnchor="middle"
          fill="url(#grad)"
          className={styles.curvedText}
        >
          <textPath href="#trivib-curve" startOffset="50%">
            TRIVIB
          </textPath>
        </text>

        {/* 👽 Floating alien */}
        <text
          x="715"
          y={180 + floatY}
          fontSize="130"
          className={styles.alien}
        >
          👽
        </text>
      </svg>
    </div>
  );
}
