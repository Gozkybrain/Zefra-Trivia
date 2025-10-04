"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>
        © {new Date().getFullYear()} Trivib. All rights reserved.{" "}
        <Link href="/terms" style={styles.link}>
          Terms & Conditions
        </Link>
      </p>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: "auto",
    padding: "16px 20px",
    backgroundColor: "#0f172a",
    color: "#fff",
    textAlign: "left",
  },
  text: {
    fontSize: "14px",
    opacity: 0.7,
  },
  link: {
    color: "#22d3ee",
    textDecoration: "none",
    marginLeft: "8px",
    opacity: 1,
  },
};
