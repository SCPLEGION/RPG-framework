import express from 'express';
import passport from '../passport.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { querry } from '../utils/database.js';

dotenv.config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Encrypt user info for token storage
function encrypt(userId, username) {
  const secret = process.env.ENCRYPT_SECRET || 'default_secret_key';
  const iv = crypto.randomBytes(16);
  const key = crypto.createHash('sha256').update(secret).digest();
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  let encrypted = cipher.update(`${userId}:${username}`, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
}

// Step 1: Redirect to Discord login
router.get('/discord', passport.authenticate('discord'));

// Step 2: Discord callback
// Define a User type for clarity (if using TypeScript, use 'interface' or 'type')
/**
 * @typedef {Object} DiscordUser
 * @property {string} id
 * @property {string} username
 * @property {string} discriminator
 * @property {string} [avatar]
 */

// If using TypeScript, you can import or define the interface instead

router.get(
  '/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/' }),
  async (req, res) => {
    try {
      /** @type {DiscordUser} */
      const user = /** @type {any} */ (req.user);

      const avatarUrl = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : null;

      // Encrypt user token
      const encryptedToken = encrypt(user.id, user.username);

      // JWT payload
      const payload = {
        id: user.id,
        username: user.username,
        discriminator: user.discriminator,
        avatar: avatarUrl,
        role: 'user'
      };

      const jwtToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });

      // Save to DB (upsert)
      await querry(
        `INSERT INTO users (id, username, discriminator, role, token) VALUES (?, ?, ?, ?, ?) 
         ON CONFLICT(id) DO UPDATE SET username = ?, discriminator = ?`,
        [
          user.id,
          user.username,
          user.discriminator,
          'user',
          encryptedToken,
          user.username,
          user.discriminator
        ]
      );

      const params = new URLSearchParams({
        userId: user.id,
        username: user.username,
        avatar: avatarUrl || '',
        token: jwtToken // Frontend gets JWT
      }).toString();

      res.redirect(`http://localhost:3001/login/callback?${params}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.status(500).send('Authentication failed');
    }
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

export default router;
