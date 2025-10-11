"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../components/AuthProvider";
import styles from "./profile.module.css";

const emojiOptions = ["👽", "👨‍🚀", "🥷", "🧙‍♂️", "🕵️‍♀️", "🧛‍♂️", "🧚‍♀️", "🦸‍♂️"];

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfile(snap.data());
          setSelectedAvatar(snap.data().avatar);
        }

        // Load transactions
        const txRef = collection(db, "transactions");
        const q = query(txRef, where("userId", "==", user.uid));
        const txSnap = await getDocs(q);

        let totalBalance = 0;
        const txs = txSnap.docs.map((d) => {
          const data = d.data();
          if (data.type === "credit") totalBalance += Number(data.amount || 0);
          if (data.type === "debit") totalBalance -= Number(data.amount || 0);
          return { id: d.id, ...data };
        });

        setTransactions(txs.sort((a, b) => b.date?.seconds - a.date?.seconds));
        setBalance(totalBalance);
      } catch (err) {
        console.error("🔥 Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user]);

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

  if (loading) return <div className={styles.center}><p>Loading profile...</p></div>;
  if (!profile) return <div className={styles.center}><p>Profile not found 😕</p></div>;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.avatarSection}>
          <div
            className={styles.avatar}
            onClick={() => setShowAvatarPicker(true)}
            title="Click to change avatar"
          >
            {selectedAvatar || "👤"}
          </div>
          <div className={styles.userInfo}>
            {editing ? (
              <input
                type="text"
                value={profile.username || ""}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className={styles.input}
              />
            ) : (
              <h2 className={styles.username}>{profile.username || "Unnamed Player"}</h2>
            )}
            <p className={styles.email}>{profile.email || user.email}</p>
          </div>
        </div>

        <div className={styles.bioSection}>
          {editing ? (
            <>
              <textarea
                value={profile.bio || ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
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
                      className={`${styles.emojiOption} ${
                        selectedAvatar === emoji ? styles.selectedEmoji : ""
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
            <h4>💰 Balance</h4>
            <p>₦{balance.toLocaleString()}</p>
          </div>
          <div className={styles.statBox}>
            <h4>🎮 Games Played</h4>
            <p>{profile.stats?.gamesPlayed || 0}</p>
          </div>
          <div className={styles.statBox}>
            <h4>🏆 Wins</h4>
            <p>{profile.stats?.wins || 0}</p>
          </div>
          <div className={styles.statBox}>
            <h4>📅 Joined</h4>
            <p>
              {profile.createdAt?.seconds
                ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString()
                : "Unknown"}
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          {editing ? (
            <>
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button className={styles.cancelBtn} onClick={() => setEditing(false)}>
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

      <div className={styles.transactionsCard}>
        <h3>🧾 Transaction Log</h3>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <ul className={styles.txList}>
            {transactions.map((tx) => (
              <li key={tx.id} className={styles.txItem}>
                <span>{tx.type === "credit" ? "🟢 Credit" : "🔴 Debit"}</span>
                <span>₦{tx.amount}</span>
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
    </div>
  );
}
