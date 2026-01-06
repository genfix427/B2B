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
      
      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }
      
      next();
    } catch (error) {
      console.error('JWT verification failed:', error.message);
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
  // For now, we'll use a simple email check
  // You should implement proper role-based authorization
  if (req.user && req.user.email === 'admin@matchrx.com') {
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