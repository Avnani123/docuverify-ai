const jwt = require('jsonwebtoken');

// Middleware to verify a general valid JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Expects "Bearer <token>"

  if (!token) {
    return res.status(401).json({ msg: 'Access Denied: No authentication token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_hackathon_key_123');
    req.user = verified; // Appends token payload data (id and role) to req.user
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token validation failed. Access unauthorized.' });
  }
};

// Middleware to check if the user is strictly an administrator
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ msg: 'Access Denied: Administrative clearance required.' });
    }
  });
};

module.exports = { verifyToken, verifyAdmin };