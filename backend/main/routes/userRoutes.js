// src/routes/userRoutes.js

import express from 'express';
import {getUsers ,createUser, getUser, updateUser, deleteUser } from '../controllers/userController.js';
import { querry } from '../utils/database.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     description: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *             example:
 *               name: John Doe
 *               email: johndoe@example.com
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *               example:
 *                 id: 1
 *                 name: John Doe
 *                 email: johndoe@example.com
 */
/**
 * @swagger
 * /api/user/me:
 *   get:
 *     description: Get current authenticated user information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved current user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 discriminator:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 avatarUrl:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/user/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No valid token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
    
    // Get user from database
    const users = await querry('SELECT * FROM users WHERE id = ?', [decoded.id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];
    
    // Construct avatar URL if user has an avatar
    const avatarUrl = decoded.avatar ? 
      `https://cdn.discordapp.com/avatars/${decoded.id}/${decoded.avatar.split('/').pop().split('.')[0]}.png` : 
      null;

    const userInfo = {
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatar: decoded.avatar ? decoded.avatar.split('/').pop().split('.')[0] : null,
      avatarUrl: avatarUrl,
      role: user.role || 'user'
    };

    res.status(200).json(userInfo);
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    res.status(500).json({ message: 'Error fetching user info', error: error.message });
  }
});

router.post('/users', createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     description: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *               example:
 *                 id: 1
 *                 name: John Doe
 *                 email: johndoe@example.com
 */
router.get('/users/:id', getUser);
/**
 * @swagger
 * /api/users:
 *   get:
 *     description: Get a user by ID
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *               example:
 *                 id: 1
 *                 name: John Doe
 *                 email: johndoe@example.com
 */
router.get('/users', getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     description: Update user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *             example:
 *               name: John Doe
 *               email: johndoe@example.com
 *     responses:
 *       200:
 *         description: Successfully updated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *               example:
 *                 id: 1
 *                 name: John Doe
 *                 email: johndoe@example.com
 */
router.put('/users/:id', updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     description: Delete user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', deleteUser);

export default router;
