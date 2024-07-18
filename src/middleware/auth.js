const { verifyAccessToken } = require('../utils/jwt');

//Middleware to verify JWT token
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
      return res.status(401).json({ message: 'Token missing.' });
  }

  try {
      const user = verifyAccessToken(token);
      req.user = user;
      next();
  } catch (err) {
      console.error('Token verification failed:', err);
      res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
