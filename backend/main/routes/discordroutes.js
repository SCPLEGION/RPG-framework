import express from 'express';
import { fetchavatar } from '../src/bot.js';
const router = express.Router();

// Mock data for user count
const mockUserCount = 1234;

// Route to fetch user count
router.get('/user-count', (req, res) => {
    try {
        res.json({ count: mockUserCount });
    } catch (error) {
        console.error("Error fetching user count:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


/**
 * @swagger
 * /api/user/avatar/{userid}:
 *   get:
 *     description: Get the avatar URL of a user by their ID
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved avatar URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avatarUrl:
 *                   type: string
 *               example:
 *                 avatarUrl: "https://example.com/avatar.jpg"
 *       404:
 *         description: Avatar not found
 *       500:
 *         description: Internal Server Error
 */


router.get('/user/avatar/:userid', async (req, res) => {
    const { userid } = req.params;
    try {
        const avatarUrl = await fetchavatar(userid);
        if (avatarUrl) {
            res.json({ avatarUrl });
        } else {
            res.status(404).json({ error: "Avatar not found" });
        }
    } catch (error) {
        console.error("Error fetching avatar:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;