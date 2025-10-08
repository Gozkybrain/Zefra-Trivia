"use client";

import React from "react";
import styles from "../styles/Loader.module.css";

export default function Loader() {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.loaderBox}>
        {/* Curved Text */}
        <svg
          viewBox="0 0 300 150"
          className={styles.curvedText}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <path
              id="curve"
              d="M 50 120 A 100 100 0 0 1 250 120"
              fill="transparent"
            />
          </defs>
          <text className={styles.loaderText}>
            <textPath href="#curve" startOffset="50%" textAnchor="middle">
              TRIVIB
            </textPath>
          </text>
        </svg>

        {/* Alien Icon */}
        <div className={styles.alienWrapper}>👽</div>
      </div>
    </div>
  );
}
