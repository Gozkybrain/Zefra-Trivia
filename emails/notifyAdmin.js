export const notifyAdminTemplate = (username, email) => `
  <h2>👤 New User Registered</h2>
  <p><b>Username:</b> ${username}</p>
  <p><b>Email:</b> ${email}</p>
  <p>Check Firestore for more details.</p>
`;
