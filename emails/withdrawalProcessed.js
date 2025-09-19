export const withdrawalProcessedTemplate = (username, amount, status) => `
  <h2>✅ Withdrawal Update</h2>
  <p>Hi ${username}, your withdrawal of <b>${amount} NGN</b> has been <b>${status}</b>.</p>
  <p>Thanks for using Zefra Trivia!</p>
`;
