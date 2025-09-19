export const gameLossTemplate = (username, amountStaked) => `
  <h2>😢 Better luck next time, ${username}!</h2>
  <p>You lost your trivia match.</p>
  <p>Staked Amount: <b>${amountStaked} tokens</b></p>
  <p>Don’t give up — your next win is waiting!</p>
`;
