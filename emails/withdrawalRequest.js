export const withdrawalRequestTemplate = (username, amount, tokens) => `
  <h2>🏦 Withdrawal Request</h2>
  <p>User <b>${username}</b> has requested a withdrawal.</p>
  <p><b>Amount:</b> ${amount} NGN (${tokens} tokens)</p>
  <p>Pending admin approval.</p>
`;
