const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extract token from the Authorization Header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication failed: Missing token header.' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token with your environment secret
    // Use your exact JWT secret variable (e.g., process.env.JWT_SECRET)
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_fallback_secret');

    // 3. Attach the decrypted user identity fields securely to the request pipeline
    req.user = {
      id: decodedToken.id || decodedToken.userId,
      email: decodedToken.email
    };

    next();
  } catch (err) {
    console.error('JWT Signature Matching Aborted:', err.message);
    return res.status(401).json({ 
      message: 'Token encryption signature authentication tracking failed.',
      error: err.message 
    });
  }
};

module.exports = authMiddleware;