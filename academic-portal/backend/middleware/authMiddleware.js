const jwt = require('jsonwebtoken');

// Protect middleware - verifies JWT token
const protect = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ msg: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = data;
    req.user._id = data.id; // Set _id for controller compatibility
    req.userId = data.id;
    req.userRole = data.role;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

// Authorize middleware - checks if user has required role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: 'Not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Not authorized for this action' });
    }
    
    next();
  };
};

module.exports = { protect, authorize };
