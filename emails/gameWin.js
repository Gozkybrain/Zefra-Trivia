export const gameWinTemplate = (username, amountWon, newBalance) => `
  <h2>🏆 Congratulations, ${username}!</h2>
  <p>You’ve won your trivia match 🎉</p>
  <p>Prize: <b>${amountWon} tokens</b></p>
  <p>New Balance: <b>${newBalance} tokens</b></p>
  <p>Keep playing to climb the leaderboard 🚀</p>
`;
