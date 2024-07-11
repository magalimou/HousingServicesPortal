const { verifyAccessToken } = require('../utils/jwt');

//Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token not given' });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Error verifying token JWT:', err);
    res.status(401).json({ message: 'Invalid Token.' });
  }
};
