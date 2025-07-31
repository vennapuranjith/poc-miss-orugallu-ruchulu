const jwt = require('jsonwebtoken');
const { poolPromise } = require('../models/db');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    const userId = req.user && req.user.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', userId)
      .query('SELECT Role FROM Users WHERE UserID = @userId');

    if (result.recordset.length === 0 || result.recordset[0].Role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { verifyToken, verifyAdmin };