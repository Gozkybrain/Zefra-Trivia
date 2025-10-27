"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Loader from "@/components/Loader";
import styles from "../../profile/profile.module.css"; // reuse existing CSS

// 🕒 Time formatter
function timeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? "s" : ""} ago`;
}

export default function PublicProfile() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const ref = doc(db, "users", id);
                const snap = await getDoc(ref);
                if (snap.exists()) setUserData(snap.data());
                else console.error("User not found");
            } catch (err) {
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchUser();
    }, [id]);

    if (loading) return <Loader />;
    if (!userData)
        return (
            <div className={styles.center}>
                <p>User not found 😕</p>
            </div>
        );

    const isSelf = user?.uid === id;

    const handleStartGame = () => {
        router.push(`/dashboard/play?opponentId=${id}`);
    };


    return (
        <div className={styles.page}>
            {/* 🧍 Profile Card */}
            <div className={styles.card}>
                <div className={styles.avatarSection}>
                    <div className={styles.avatar}>{userData.avatar || "👤"}</div>
                    <div className={styles.userInfo}>
                        <h2 className={styles.username}>{userData.username || "Unnamed Player"}</h2>
                        <p className={styles.email}>{userData.email}</p>
                    </div>
                </div>

                <div className={styles.bioSection}>
                    <p className={styles.bio}>
                        {userData.bio?.trim()
                            ? userData.bio
                            : "🚀 Just another trivia warrior waiting for the next challenge."}
                    </p>
                </div>

                <div className={styles.stats}>
                    <div className={styles.statBox}>
                        <h4>📅 Joined</h4>
                        <p>
                            {userData.createdAt?.seconds
                                ? timeAgo(new Date(userData.createdAt.seconds * 1000))
                                : "Unknown"}
                        </p>
                    </div>

                    <div className={styles.statBox}>
                        <h4>🎮 Games</h4>
                        <p>{userData.stats?.gamesPlayed || 0}</p>
                    </div>

                    <div className={styles.statBox}>
                        <h4>🏆 Wins</h4>
                        <p>{userData.stats?.wins || 0}</p>
                    </div>
                </div>

                {!isSelf && (
                    <div className={styles.actions}>
                        <button className={styles.playBtn} onClick={handleStartGame}>
                            Start a Game with {userData.username || "this player"} 🎮
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
