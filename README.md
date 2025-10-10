# 🎮 TriviB

Zefra TriviB is a peer-to-peer (P2P) trivia game built with **Next.js, Firebase, Firestore, and OpenRouter AI**.  
Players compete in real-time or asynchronously, staking in-app tokens that can be converted to real money via **Paystack**.  

---

## 🚀 Core Features

- **Authentication & Profiles**
  - Firebase Auth (email/password + optional social login).
  - User profile with username + selectable avatar.
  - Tracks stats: matches played, wins/losses, tokens earned.

- **Wallet & Tokens**
  - In-app tokens only (`₦1000 = 100 Tokens`).
  - Deposit/Withdraw via Paystack.
  - Balance displayed in dashboard.
  - Stakes locked in escrow until match resolution.
  - System takes **10% fee** from winnings.

- **Game Modes**
  1. **Play Online (Live 1v1)**
     - Player A selects 2 subjects → challenges Player B.
     - Player B accepts → selects 2 subjects.
     - AI generates 10 unique Qs for each player.
     - 10s timer per question with instant feedback (✅ correct, ❌ wrong).
     - Pot goes to winner minus 10% fee.
  
  2. **Play & Wait (Async 1v1)**
     - Player A plays first, Player B later.
     - No expiry (creator can cancel if unaccepted).
     - Stakes remain locked until resolved.

  3. **Demo Mode**
     - Free-to-play.
     - Ads integrated.
     - No tokens, no leaderboard.

  4. **AI Mode**
     - Player challenges AI (70% win chance for AI).
     - Tokens staked as normal, payout if player wins.

- **Trivia Questions**
  - Subjects: Fixed 10 categories (hardcoded).
  - AI (OpenRouter) generates 10 Qs **at match start**.
  - Qs stored in Firestore temporarily → auto-deleted after match.
  - Metadata (score, outcome) retained.

- **Leaderboard**
  - Global leaderboard (top-ranked players).
  - Tracks cumulative tokens won, win rate, and subjects played.

- **PWA Support**
  - Installable on mobile/desktop.
  - Push notifications (async match reminders).
  - Offline-friendly (demo mode works).

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS.
- **Backend**: Firebase Auth + Firestore (real-time listeners).
- **AI Engine**: OpenRouter (LLM-powered question generation).
- **Payments**: Paystack (deposits/withdrawals).
- **Deployment**: Vercel (frontend) + Firebase Hosting/Functions (backend if needed).
- **Extras**: PWA integration for installable app experience.

---


## ⚡ Firestore Schema (Draft)

### `users`
```json
{
  "uid": "string",
  "username": "string",
  "avatar": "string",
  "balance": 500,
  "stats": {
    "gamesPlayed": 12,
    "wins": 7,
    "losses": 5,
    "tokensEarned": 300
  },
  "createdAt": "timestamp"
}
```


### `matches`
```json
{
  matchId: "auto_or_uuid",              // unique match identifier
  type: "solo" | "online" | "p2p",              // distinguishes single-player vs. multiplayer

  // 🔹 Creator & participants
  playerA: "uid",                       // always set (creator)
  playerB: "uid" | null,                // optional (for solo or unjoined games)

  // 🔹 Game content
  subjects: ["History", "Science"],     // chosen topics
  questions: {
    playerA: [...],                     // list of player A’s questions
    playerB: [...]                      // list of player B’s questions (if exists)
  },

  // 🔹 State and progression
  status: "waiting" | "active" | "completed" | "cancelled",
  stake: 50,                            // wagered amount, or 0 for solo/AI games
  winner: "uid" | "ai" | null,          // AI can be tagged explicitly
  isLive: true,                         // for quick filtering of active matches

  // 🔹 Meta
  createdAt: serverTimestamp(),
  completedAt: null,
  duration: null,                       // optional — total seconds or ms
}

```



### 📧 Email Notifications

We use **Nodemailer** for transactional emails.  


| Event                | Recipient | Template File                  | Trigger Point / Description |
|----------------------|-----------|--------------------------------|----------------------------|
| User Registration    | User      | `welcomeUser.js`               | After `/api/auth/register` success |
| Password Reset       | User      | `passwordReset.js`             | After user requests password reset |
| Deposit Success      | User      | `depositSuccess.js`            | After payment webhook confirms deposit |
| Withdrawal Request   | Admin     | `withdrawalRequest.js`         | After user submits withdrawal request |
| Withdrawal Processed | User      | `withdrawalProcessed.js`       | After admin approves and processes withdrawal |
| Game Invitation      | User      | `gameInvitation.js`            | When another player sends a game invite |
| Game Accepted        | User      | `gameAccepted.js`              | When opponent accepts the game invite |
| Game Result (Win)    | User      | `gameWin.js`                   | After game engine calculates winner |
| Game Result (Loss)   | User      | `gameLoss.js`                  | After game engine calculates loser |
| Game Result          | Admin     | `adminGameResult.js`           | After game engine settles payout: winner, loser, stake, fee |

---

**Templates** live in `/emails`.  
**Mailer logic** lives in `/lib/mailer.js`.  
