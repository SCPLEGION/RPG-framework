// src/app.js

import './instrument.js'

import express from 'express';
import yaml from 'js-yaml';
import swaggerJsdoc from 'swagger-jsdoc';
import authRoutes from './routes/authRoutes.js';
import ballisticsRoutes from './routes/ballisticsRoutes.js';
import configRoutes from './routes/configRoutes.js';
import discordroutes from './routes/discordroutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import userRoutes from './routes/userRoutes.js';
import helmet from "helmet";
import { bus } from './utils/Commbus.js';
import session from 'express-session';
import passport from './passport.js';
import * as Sentry from '@sentry/node';
import compression from 'compression';


const app = express();
app.use(helmet())

// Enable compression for all responses
app.use(compression());

// Only log slow requests in production
const isProduction = process.env.NODE_ENV === 'production';
const slowRequestThreshold = parseInt(process.env.SLOW_REQUEST_MS || '100', 10);

app.use((req, res, next) => {
  const reqStart = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - reqStart;
    if (!isProduction && duration > slowRequestThreshold) {
      console.log(`[TIMER] ${req.method} ${req.url} took ${duration}ms`);
    }
  });
  next();
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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

// Generate Swagger YAML once at startup and cache it
let swaggerYaml = null;

const getSwaggerYaml = () => {
  if (!swaggerYaml) {
    const swaggerDocs = swaggerJsdoc(swaggerOptions);
    swaggerYaml = yaml.dump(swaggerDocs);
  }
  return swaggerYaml;
};

// Serve /api/swagger.yaml WITHOUT authentication - with caching headers
app.get('/api/swagger.yaml', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.type('text/yaml').send(getSwaggerYaml());
});

// Use routes (these are protected)
app.use('/auth', authRoutes);
app.use('/api/ballistics', ballisticsRoutes); // Ballistics routes (public)
app.use('/api', configRoutes); // Config routes (public)
app.use('/api', discordroutes);
app.use('/api', userRoutes);
app.use('/api', ticketRoutes);
app.get('/api/me', (req, res) => {
  // @ts-ignore
  res.json({ user: req.user });
});


app.get("/", function rootHandler(req, res) {
  res.end("Hello world!");
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// Record server start time
const serverStart = Date.now();



app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

Sentry.setupExpressErrorHandler(app);

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
