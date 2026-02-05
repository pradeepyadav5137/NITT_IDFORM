
import jwt from 'jsonwebtoken';

export const adminAuth = (req, res, next) => {
  try {
    // Get token from cookie or header
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if it's an admin token (should have username or role)
    if (!decoded.username && !decoded.role) {
      return res.status(401).json({ message: 'Not authorized as admin' });
    }

    // Attach admin info to request
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};