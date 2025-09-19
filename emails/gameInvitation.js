export const gameInvitationTemplate = (challenger, subjectChoices) => `
  <h2>🎮 Game Invitation</h2>
  <p><b>${challenger}</b> has invited you to a trivia match!</p>
  <p>They’ve chosen categories: <b>${subjectChoices.join(", ")}</b></p>
  <p>Log in now to accept the challenge and choose your own subjects.</p>
`;
