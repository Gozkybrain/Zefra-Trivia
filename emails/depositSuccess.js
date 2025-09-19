export const depositSuccessTemplate = (username, amount, tokens) => `
  <h2>💰 Deposit Successful</h2>
  <p>Hi ${username}, your deposit of <b>${amount} NGN</b> was successful.</p>
  <p>You’ve received <b>${tokens} Zefra Tokens</b> in your wallet 🎉</p>
`;
