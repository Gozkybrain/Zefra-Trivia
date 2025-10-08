export const WelcomeUser = (user) => `
  <div style="font-family: Arial, sans-serif; text-align: center; padding: 2rem;">
    <img src="https://yourdomain.com/trivibv7.png" alt="Trivib" width="100" />
    <h1 style="color: #7b5eff;">Welcome to Trivib, ${user.username} 👽</h1>
    <p style="font-size: 1rem; color: #333;">
      We're excited to have you on board! 🎉<br />
      Dive into the world of peer-to-peer trivia battles and start earning with your brain.
    </p>
    <a href="https://yourdomain.com/login" 
       style="display: inline-block; padding: 10px 20px; margin-top: 1rem;
              background: #7b5eff; color: #fff; text-decoration: none;
              border-radius: 8px;">
      Go to Dashboard
    </a>
    <p style="font-size: 0.9rem; color: #555; margin-top: 2rem;">
      — The Trivib Team 👽
    </p>
  </div>
`;
