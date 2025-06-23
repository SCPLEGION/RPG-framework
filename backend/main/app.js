// src/app.js

import cookieParser from 'cookie-parser';
import express from 'express';
import yaml from 'js-yaml';
import swaggerJsdoc from 'swagger-jsdoc';
import { authenticateJWT } from './middleware/auth.js';
import authRoutes from './routes/authRoutes.js';
import discordroutes from './routes/discordroutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { bus } from './utils/Commbus.js';
import session from 'express-session';
import passport from './passport.js';


const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Add session and passport middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

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
  apis: ['./routes/*.js'],
  components: ['./components/*.js'],
};

// Generate Swagger YAML once at startup
const swaggerDocs = swaggerJsdoc(swaggerOptions);
const swaggerYaml = yaml.dump(swaggerDocs);

// Serve /api/swagger.yaml WITHOUT authentication
app.get('/api/swagger.yaml', (req, res) => {
  res.type('text/yaml').send(swaggerYaml);
});

// Use routes (these are protected)
app.use('/api', authenticateJWT, userRoutes);
app.use('/api', authenticateJWT, ticketRoutes);
app.use('/auth', authRoutes);
app.use('/api', authenticateJWT, discordroutes);
app.get('/api/me', authenticateJWT, (req, res) => {
  // @ts-ignore
  res.json({ user: req.user });
});


app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the SCP RPG Discord Bot API!',
  });
});

// Record server start time
const serverStart = Date.now();

// Middleware to time each request
app.use((req, res, next) => {
  const reqStart = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - reqStart;
    console.log(`[TIMER] ${req.method} ${req.url} took ${duration}ms`);
  });
  next();
});

// Listen for botReady event and start server only when bot is ready
bus.once('botReady', (ready) => {
    if (ready) {
        const startupDuration = Date.now() - serverStart;
        app.listen(3000, () => {
            console.log('===========================================');
            console.log('🚀 Server is running on http://localhost:3000');
            console.log('📄 Swagger YAML available at http://localhost:3000/api/swagger.yaml');
            console.log('🖥️  Swagger UI is available at http://localhost:3000/api-docs');
            console.log(`⏱️  Startup time: ${startupDuration}ms`);
            console.log('===========================================');
        });
    }
});
