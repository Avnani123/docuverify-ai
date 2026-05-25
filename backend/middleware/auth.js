const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Read token allocation out from authorization headers matrix
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No authorization token discovered. Access revoked.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_encryption_key');
    // Expecting token payload mapping setup format structure: { user: { id: "...", role: "..." } }
    req.user = decoded.user; 
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token encryption signature authentication tracking failed.' });
  }
};