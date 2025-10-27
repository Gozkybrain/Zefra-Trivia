"use client";

import { useEffect, useState } from "react";
import {
    doc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../components/AuthProvider";
import styles from "./profile.module.css";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";


// * Avatar Emoji Selector
const emojiOptions = ["👽", "👨‍🚀", "🥷", "🧙‍♂️", "🕵️‍♀️", "🧛‍♂️", "🧚‍♀️", "🦸‍♂️"];

// * time function
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


export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();

    const [profile, setProfile] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [createdGames, setCreatedGames] = useState([]);
    const [invitedGames, setInvitedGames] = useState([]);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(null);


    // * Helper to fetch username from user ID
    const fetchUsernameById = async (uid) => {
        try {
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                return userSnap.data().username || "Unknown";
            }
        } catch (err) {
            console.error("Error fetching username:", err);
        }
        return "Unknown";
    };


    useEffect(() => {
        if (!user) return;

        const loadProfile = async () => {
            try {
                // * Load user profile
                const ref = doc(db, "users", user.uid);
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    setProfile(snap.data());
                    setSelectedAvatar(snap.data().avatar);
                }

                // * Load transactions
                const txRef = collection(db, "transactions");
                const qTx = query(txRef, where("userId", "==", user.uid));
                const txSnap = await getDocs(qTx);

                let totalBalance = 0;
                const txs = txSnap.docs.map((d) => {
                    const data = d.data();
                    if (data.type === "credit") totalBalance += Number(data.amount || 0);
                    if (data.type === "debit") totalBalance -= Number(data.amount || 0);
                    return { id: d.id, ...data };
                });
                setTransactions(txs.sort((a, b) => b.date?.seconds - a.date?.seconds));
                setBalance(totalBalance);

                // * Games as Player A
                const gamesRef = collection(db, "games");
                const qA = query(gamesRef, where("playerA", "==", user.uid));
                const snapA = await getDocs(qA);
                const playerAGames = snapA.docs.map((d) => ({ id: d.id, ...d.data() }));

                setCreatedGames(playerAGames);

                // * Games where user is invited (playerB)
                const qB = query(gamesRef, where("playerB", "==", user.uid));
                const snapB = await getDocs(qB);
                const invitedGamesRaw = snapB.docs.map((d) => ({ id: d.id, ...d.data() }));

                // * Fetch creator usernames
                const gamesWithCreator = await Promise.all(
                    invitedGamesRaw.map(async (game) => {
                        const username = await fetchUsernameById(game.playerA);
                        return { ...game, creator: { username } };
                    })
                );

                setInvitedGames(gamesWithCreator);
            } catch (err) {
                console.error("🔥 Error loading profile:", err);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [user]);


    // * Save profile changes
    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const ref = doc(db, "users", user.uid);
            await updateDoc(ref, {
                username: profile.username,
                avatar: selectedAvatar,
                bio: profile.bio || "",
            });
            setEditing(false);
        } catch (err) {
            console.error("❌ Error saving profile:", err);
        } finally {
            setSaving(false);
        }
    };

    // * Game actions
    const handleDelete = async (id) => {
        if (!confirm("Delete this game?")) return;
        await deleteDoc(doc(db, "games", id));
        setCreatedGames((prev) => prev.filter((g) => g.id !== id));
    };

    const handleAccept = async (id) => {
        const ref = doc(db, "games", id);
        await updateDoc(ref, { status: "live" });
        setInvitedGames((prev) =>
            prev.map((g) => (g.id === id ? { ...g, status: "live" } : g))
        );
        alert("✅ Game accepted! You can now play.");
    };

    const handleReject = async (id) => {
        const ref = doc(db, "games", id);
        await updateDoc(ref, { status: "rejected" });
        setInvitedGames((prev) => prev.filter((g) => g.id !== id));
        alert("❌ Game invitation rejected.");
    };

    const handlePlayNow = (id) => {
        router.push(`/dashboard/game/${id}`);
    };

    if (loading) return <Loader />;
    if (!profile) {
        return (
            <div className={styles.center}>
                <p>Profile not found 😕</p>
            </div>
        );
    }


    return (
        <div className={styles.page}>
            {/* 🧍 Profile Card */}
            <div className={styles.card}>
                <div className={styles.avatarSection}>
                    <div
                        className={styles.avatar}
                        onClick={() => setEditing(true)}
                        title="Click to change avatar"
                    >
                        {selectedAvatar || "👤"}
                    </div>
                    <div className={styles.userInfo}>
                        <div className={styles.nameRow}>
                            {editing ? (
                                <input
                                    type="text"
                                    value={profile.username || ""}
                                    onChange={(e) =>
                                        setProfile({ ...profile, username: e.target.value })
                                    }
                                    className={styles.input}
                                />
                            ) : (
                                <h2 className={styles.username}>
                                    {profile.username || "Unnamed Player"}
                                </h2>
                            )}

                            {/* 🛠️ Admin Mode Button */}
                            {profile.role === "admin" && (
                                <button
                                    className={styles.adminBtn}
                                    onClick={() => router.push("/admin")}
                                    title="Switch to Admin Dashboard"
                                >
                                    Admin Mode
                                </button>
                            )}
                        </div>
                        <p className={styles.email}>{profile.email || user.email}</p>
                    </div>
                </div>


                <div className={styles.bioSection}>
                    {editing ? (
                        <>
                            <textarea
                                value={profile.bio || ""}
                                onChange={(e) =>
                                    setProfile({ ...profile, bio: e.target.value })
                                }
                                placeholder="Write something about yourself..."
                                className={styles.textarea}
                            />
                            <div className={styles.emojiPicker}>
                                <p>Select Avatar:</p>
                                <div className={styles.emojiGrid}>
                                    {emojiOptions.map((emoji) => (
                                        <span
                                            key={emoji}
                                            onClick={() => setSelectedAvatar(emoji)}
                                            className={`${styles.emojiOption} ${selectedAvatar === emoji ? styles.selectedEmoji : ""
                                                }`}
                                        >
                                            {emoji}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className={styles.bio}>
                            {profile.bio?.trim()
                                ? profile.bio
                                : "🚀 Just another trivia warrior waiting for the next challenge."}
                        </p>
                    )}
                </div>

                <div className={styles.stats}>
                    <div className={styles.statBox}>
                        <h4>🪙 Balance</h4>
                        <p>{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className={styles.statBox}>
                        <h4>📅 Joined</h4>
                        <p>
                            {profile.createdAt?.seconds
                                ? timeAgo(new Date(profile.createdAt.seconds * 1000))
                                : "Unknown"}
                        </p>
                    </div>

                    <div className={styles.statBox}>
                        <h4>🎮 Games</h4>
                        <p>{profile.stats?.gamesPlayed || 0}</p>
                    </div>
                    <div className={styles.statBox}>
                        <h4>🏆 Wins</h4>
                        <p>{profile.stats?.wins || 0}</p>
                    </div>

                </div>

                <div className={styles.actions}>
                    {editing ? (
                        <>
                            <button
                                className={styles.saveBtn}
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => setEditing(false)}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button className={styles.editBtn} onClick={() => setEditing(true)}>
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* 💰 Transactions */}
            <div className={styles.transactionsCard}>
                <h3>Transaction Log</h3>
                {transactions.length === 0 ? (
                    <p>No transactions yet.</p>
                ) : (
                    <ul className={styles.txList}>
                        {transactions.map((tx) => (
                            <li key={tx.id} className={styles.txItem}>
                                <span>{tx.type === "credit" ? "🟢" : "🔴"}</span>
                                <span>🪙 {tx.amount}</span>
                                <span>{tx.description}</span>
                                <span>
                                    {tx.date?.seconds
                                        ? new Date(tx.date.seconds * 1000).toLocaleDateString()
                                        : "—"}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* 🎯 Games Created */}
            <div className={styles.gamesCard}>
                <h3>Games You Created</h3>
                {createdGames.length === 0 ? (
                    <p>No games created yet.</p>
                ) : (
                    <ul className={styles.gameList}>
                        {createdGames.map((g) => (
                            <li key={g.id} className={styles.gameItem}>
                                <div>
                                    <strong>
                                        {Array.isArray(g.subjects)
                                            ? g.subjects.join(", ")
                                            : g.subjects || g.type || "Untitled Game"}
                                    </strong>
                                    <p>Stake: 🪙 {g.stake || 0}</p>

                                    <div className={styles.gameActions}>
                                        {g.status === "live" && (
                                            <button
                                                className={styles.playBtn}
                                                onClick={() => handlePlayNow(g.id)}
                                            >
                                                Play Now
                                            </button>
                                        )}
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleDelete(g.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* 🤝 Games Invited */}
            <div className={styles.gamesCard}>
                <h3>Games You Were Invited To</h3>
                {invitedGames.length === 0 ? (
                    <p>No invitations yet.</p>
                ) : (
                    <ul className={styles.gameList}>
                        {invitedGames.map((g) => (
                            <li key={g.id} className={styles.gameItem}>
                                <div>
                                    <strong>
                                        {(Array.isArray(g.subjects) && g.subjects.length > 0
                                            ? g.subjects.join(", ")
                                            : "—") + ` from ${g.creator?.username || "Unknown"}`}
                                    </strong>
                                    <p>
                                        Stake: 🪙{" "}
                                        {Number(g.stake || 0).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </p>

                                    <div className={styles.gameActions}>
                                        {g.status === "pending" ? (
                                            <>
                                                <button
                                                    className={styles.acceptBtn}
                                                    onClick={() => handleAccept(g.id)}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    className={styles.rejectBtn}
                                                    onClick={() => handleReject(g.id)}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        ) : g.status === "live" ? (
                                            <button
                                                className={styles.playBtn}
                                                onClick={() => handlePlayNow(g.id)}
                                            >
                                                Play Now
                                            </button>
                                        ) : (
                                            <span className={styles.rejectedLabel}>Rejected</span>
                                        )}
                                    </div>
                                </div>

                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
