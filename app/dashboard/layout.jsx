"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Gamepad2, Wallet2, User, Medal } from "lucide-react";
import styles from "./dashboard.module.css";

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const { user } = useAuth();

    return (
        <ProtectedRoute>
            <div className={styles.dashboardContainer}>
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <Link href="/" style={styles.logoLink}>
                            <img
                                src="/trivibv7.png"
                                alt="Trivib Logo"
                                className={styles.logoImage}
                            />
                        </Link>
                    </div>

                    <div className={styles.headerRight}>
                        <div className={styles.balanceBox}>
                            {/* display account balance */}
                            <span className={styles.coin}>🪙</span>
                            <span className={styles.balance}>
                                {user?.balance ? user.balance.toFixed(2) : "0.00"}
                            </span>
                        </div>

                        {/* display profile avatar and name */}
                        <Link href="/dashboard/profile" className={styles.avatar}>
                            <span className={styles.avatarEmoji}>
                                {user?.avatar || "👽"} {user?.username}
                            </span>
                        </Link>
                    </div>
                </header>

                {/* Main Content */}
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
                        href="/dashboard/active"
                        icon={<Medal size={20} />}
                        label="Active"
                        active={pathname.includes("/active")}
                    />
                    <NavLink
                        href="/dashboard/profile"
                        icon={<User size={20} />}
                        label="Profile"
                        active={pathname.includes("/profile")}
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
