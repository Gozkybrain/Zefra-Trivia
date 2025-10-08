export const NotifyAdmin = (user) => `
  <div style="font-family: Arial, sans-serif; padding: 2rem; background: #f7f7ff;">
    <img src="https://yourdomain.com/trivibv7.png" alt="Trivib" width="100" />
    <h2 style="color: #7b5eff;">New User Registration 🚀</h2>
    <p style="font-size: 1rem; color: #333;">
      A new user has just joined <strong>Trivib</strong>:
    </p>
    <ul style="font-size: 1rem; color: #444; list-style: none;">
      <li><strong>Name:</strong> ${user.name}</li>
      <li><strong>Email:</strong> ${user.email}</li>
      <li><strong>Joined:</strong> ${new Date().toLocaleString()}</li>
    </ul>
    <p style="font-size: 0.9rem; margin-top: 2rem; color: #555;">
      Go check the dashboard for more details.
    </p>
  </div>
`;
