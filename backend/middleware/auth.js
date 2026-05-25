const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('Authorization');

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Strip out 'Bearer ' if present in the header
        const cleanToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
        
        // Verify token
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
        
        // Add user payload from token to request object
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};