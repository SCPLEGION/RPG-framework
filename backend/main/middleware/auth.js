import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // No token provided, proceed without user
    req.user = null;
    return next();
  }

  // Split "Bearer <token>"
  const [scheme, token] = authHeader.split(' ');

  if (!token || scheme.toLowerCase() !== 'bearer') {
    req.user = null;
    return next();
  }

  try {
    // Verify JWT token
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    req.user = null;
  }
  next();
}
