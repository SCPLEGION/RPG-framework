// src/app.js

import express from 'express';
import userRoutes from './routes/userRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import authRoutes from './routes/authRoutes.js';
import discordroutes from './routes/discordroutes.js';
import swaggerJsdoc from 'swagger-jsdoc';
import yaml from 'js-yaml';
import { authenticateJWT } from './middleware/auth.js';

const app = express();

// Middleware
app.use(express.json());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API Documentation using Swagger with Express',
    },
  },
  apis: ['./routes/*.js'], // Pointing to the route files for Swagger
  components: ['./components/*.js'], // Pointing to the components files for Swagger
};

// Serve /api/swagger.yaml WITHOUT authentication
app.get('/api/swagger.yaml', (req, res) => {
  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  const swaggerYaml = yaml.dump(swaggerDocs);
  res.type('text/yaml').send(swaggerYaml);
});

// Use routes (these are protected)
app.use('/api', authenticateJWT, userRoutes);
app.use('/api', authenticateJWT, ticketRoutes);
app.use('/auth', authRoutes);
app.use('/api', discordroutes);
app.get('/api/me', authenticateJWT, (req, res) => {
  // @ts-ignore
  res.json({ user: req.user });
});


app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the SCP RPG Discord Bot API!',
  });
});

app.use((req, res, next) => {
  console.log('Time:', Date.now())
  console.log('Method:', req.method)
  console.log('URL:', req.url)
  console.log('Body:', req.body)
  console.log('Query:', req.query)
  console.log('Params:', req.params)
  next()
})

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
  console.log('Swagger UI is available at http://localhost:3000/api-docs');
});
