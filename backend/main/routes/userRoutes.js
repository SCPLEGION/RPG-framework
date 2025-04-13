// src/routes/userRoutes.js

import express from 'express';
import {getusers ,createUser, getUser, updateUser, deleteUser } from '../controllers/userController.js';

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
router.get('/users', getusers);

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
