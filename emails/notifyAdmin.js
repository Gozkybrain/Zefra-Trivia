const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const NotifyAdmin = (user) => `
  <div style="font-family: Arial, sans-serif; padding: 2rem; background: #f7f7ff;">
    <img src="${BASE_URL}/trivibv7.png" alt="Trivib" width="100" />
    <h2 style="color: #7b5eff;">New User Registration 🚀</h2>
    <p style="font-size: 1rem; color: #333;">
      A new user has just joined <strong>Trivib</strong>:
    </p>
    <ul style="font-size: 1rem; color: #444; list-style: none; padding: 0;">
      <li><strong>Username:</strong> ${user.username}</li>
      <li><strong>Email:</strong> ${user.email}</li>
      <li><strong>Joined:</strong> ${new Date().toLocaleString()}</li>
    </ul>
    <p style="font-size: 0.9rem; margin-top: 2rem; color: #555;">
      Go check the dashboard for more details.
    </p>
    <a href="${BASE_URL}/admin" 
       style="display: inline-block; padding: 10px 20px; margin-top: 1.5rem;
              background: #7b5eff; color: #fff; text-decoration: none;
              border-radius: 8px;">
      Go to Dashboard
    </a>
  </div>
`;
