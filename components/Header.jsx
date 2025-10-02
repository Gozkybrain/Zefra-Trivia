"use client";

import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header style={styles.header}>
      <Link href="/" style={styles.logoLink}>
        <h1 style={styles.logo}>Trivib</h1>
      </Link>
    </header>
  );
}

const styles = {
  header: {
    padding: "10px",
    textAlign: "left",
  },
  logoLink: {
    textDecoration: "none",
    display: "inline-block",
  },
  logo: {
    fontSize: "36px",
    fontWeight: 900,
    margin: "10px",
    background: "linear-gradient(90deg, #34d399, #22d3ee)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textShadow: `
      0 0 10px rgba(52, 211, 153, 0.4),
      0 0 10px rgba(34, 211, 238, 0.3)
    `,
  },
};
