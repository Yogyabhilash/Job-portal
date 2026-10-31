const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  // 1. Check Authorization Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Check Query String (for EJS pages/downloads)
  else if (req.query && req.query.token) {
    token = req.query.token;
  }
  // 3. Check Request Body (for EJS form posts)
  else if (req.body && req.body.token) {
    token = req.body.token;
  }

  if (!token) {
    // If it's an API request, return JSON. If it's an admin SSR request, redirect to admin login.
    if (req.originalUrl.startsWith('/admin')) {
      return res.redirect('/admin/login?error=Session expired. Please log in.');
    }
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains id and role
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    if (req.originalUrl.startsWith('/admin')) {
      return res.redirect('/admin/login?error=Session invalid. Please log in.');
    }
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      if (req.originalUrl.startsWith('/admin')) {
        return res.redirect('/admin/login?error=Access denied. Admin only.');
      }
      return res.status(403).json({
        message: `Role (${req.user ? req.user.role : 'none'}) is not authorized to access this resource`,
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
