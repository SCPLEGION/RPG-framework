import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

/**
 * @swagger
 * /api/config:
 *   get:
 *     description: Get application configuration
 *     responses:
 *       200:
 *         description: Successfully retrieved application configuration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 discord:
 *                   type: object
 *                   properties:
 *                     clientId:
 *                       type: string
 *                     oauthUrl:
 *                       type: string
 *                 app:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     version:
 *                       type: string
 *                     url:
 *                       type: string
 */
router.get('/config', (req, res) => {
  try {
    const config = {
      discord: {
        clientId: process.env.DISCORD_CLIENT_ID,
        oauthUrl: `/auth/discord`
      },
      app: {
        name: 'SCP RPG Discord Bot',
        version: '1.0.0',
        url: process.env.APP_URL || 'http://localhost:3000'
      }
    };

    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching configuration', error: error.message });
  }
});

export default router;