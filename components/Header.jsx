"use client";

import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header style={styles.header}>
      <Link href="/" style={styles.logoLink}>
        <img
          src="/trivibv7.png"
          alt="Trivib Logo"
          style={styles.logoImage}
        />
      </Link>
    </header>
  );
}

const styles = {
  header: {
    padding: "20px",
    textAlign: "left",
    position: "relative",
    zIndex: 999999,
  },
  logoLink: {
    textDecoration: "none",
    display: "inline-block",
  },
  logoImage: {
    height: "70px",
    width: "auto",
    margin: "10px",
    cursor: "pointer",
  },
};
