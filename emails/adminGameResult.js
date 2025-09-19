export const adminGameResultTemplate = (
  winner,
  loser,
  stake,
  systemFee,
  payout
) => `
  <h2>🎮 Game Result</h2>
  <p><b>${winner}</b> won against <b>${loser}</b>.</p>
  <p><b>Stake per player:</b> ${stake} tokens</p>
  <p><b>System Fee (10%):</b> ${systemFee} tokens</p>
  <p><b>Payout to Winner:</b> ${payout} tokens</p>
  <p>✅ Funds have been settled.</p>
`;
