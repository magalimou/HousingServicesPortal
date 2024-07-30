const { verifyAccessToken } = require('../utils/jwt');
const db = require('../models/db');

//Middleware to verify JWT token
module.exports = async (req, res, next) => {
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
      const [rows] = await db.query('SELECT * FROM patient WHERE id = ?', [user.id]);
      
      if(rows.length === 0) {
            return res.status(401).json({ message: 'User not found.' });
        }  

      req.user = {id: user.id, role: rows[0].role};
      next();
  } catch (err) {
      console.error('Token verification failed:', err);
      res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
