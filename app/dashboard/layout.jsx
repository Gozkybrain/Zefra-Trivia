"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Gamepad2, Wallet2, User, Settings } from "lucide-react";
import styles from "./dashboard.module.css";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Determine avatar style (emoji or image)
  const avatar =
    typeof user?.avatar === "string" && user.avatar.length <= 4
      ? user.avatar // emoji
      : user?.photoURL || "/default-avatar.png"; // fallback to photoURL or image

  return (
    <ProtectedRoute>
      <div className={styles.dashboardContainer}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.appTitle}>👽 Trivib</h2>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.balanceBox}>
              <span className={styles.coin}>🪙</span>
              <span className={styles.balance}>
                {user?.balance ? user.balance.toFixed(2) : "0.00"}
              </span>
            </div>

            <Link href="/dashboard/profile" className={styles.avatar}>
              {avatar.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/) ? (
                <span className={styles.avatarEmoji}>{avatar}</span>
              ) : (
                <img
                  src={avatar}
                  alt="avatar"
                  className={styles.avatarImg}
                  onError={(e) => (e.target.src = "/default-avatar.png")}
                />
              )}
            </Link>
          </div>
        </header>

        {/* Main */}
        <main className={styles.mainContent}>{children}</main>

        {/* Footer Nav */}
        <footer className={styles.footerNav}>
          <NavLink
            href="/dashboard"
            icon={<Home size={20} />}
            label="Home"
            active={pathname === "/dashboard"}
          />
          <NavLink
            href="/dashboard/play"
            icon={<Gamepad2 size={20} />}
            label="Play"
            active={pathname.includes("/play")}
          />
          <NavLink
            href="/dashboard/wallet"
            icon={<Wallet2 size={20} />}
            label="Wallet"
            active={pathname.includes("/wallet")}
          />
          <NavLink
            href="/dashboard/profile"
            icon={<User size={20} />}
            label="Profile"
            active={pathname.includes("/profile")}
          />
          <NavLink
            href="/dashboard/settings"
            icon={<Settings size={20} />}
            label="Settings"
            active={pathname.includes("/settings")}
          />
        </footer>
      </div>
    </ProtectedRoute>
  );
}

function NavLink({ href, icon, label, active }) {
  return (
    <Link
      href={href}
      className={`${styles.navLink} ${active ? styles.active : ""}`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
