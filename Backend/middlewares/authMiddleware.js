import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/User.js';

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as admin');
  }
};

// Check if vendor is verified
const verifiedVendor = (req, res, next) => {
  if (req.user && req.user.isVerified && req.user.verificationStatus === 'approved') {
    next();
  } else {
    res.status(401);
    throw new Error('Vendor account not verified. Please wait for admin approval.');
  }
};

export { protect, admin, verifiedVendor };