import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { db, querry } from '../src/modules/database.js';
import sha256 from 'crypto-js/sha256.js';

dotenv.config();

const router = express.Router();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3001/auth/discord/callback';

function encrypt(x, y) {
  const hashed = sha256(x + y).toString();
  return hashed;
}

// Step 1: Redirect to Discord OAuth
router.get('/discord', (req, res) => {
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=identify`;
  res.redirect(discordAuthUrl);
});

// Step 2: Handle OAuth Callback
router.get('/discord/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token } = tokenResponse.data;

    // Fetch user info
    const userResponse = await axios.get('https://discord.com/api/v9/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { id, username, discriminator } = userResponse.data;

    let token = encrypt(id, username);

    // Save user info to the database
    await querry(
      `INSERT INTO users (id, username, discriminator, role, token) VALUES (?, ?, ?, ?,?) ON CONFLICT(id) DO UPDATE SET username = ?, discriminator = ?`,
      [id, username, discriminator, 'user',token , username, discriminator]
    );

    // Redirect to frontend with user info
    res.redirect(`http://localhost:3001/login/callback?userId=${id}&username=${username}&token=${token}`);
  } catch (error) {
    console.error('Error during Discord OAuth:', error);
    res.status(500).send('Authentication failed');
  }
});



export default router;