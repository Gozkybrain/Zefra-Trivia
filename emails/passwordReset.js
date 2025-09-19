export const passwordResetTemplate = (resetLink) => `
  <h2>🔑 Password Reset Requested</h2>
  <p>Click below to reset your password:</p>
  <a href="${resetLink}" target="_blank">Reset Password</a>
  <p>If you didn’t request this, you can ignore this email.</p>
`;
