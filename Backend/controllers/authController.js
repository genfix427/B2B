import asyncHandler from '../middlewares/asyncHandler.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendVerificationEmail, sendAdminNotification } from '../utils/emailService.js';

// @desc    Register new user with all steps data
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    step1,
    step2,
    step3,
    step4,
    step5,
    step6
  } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Check if NPI exists
  if (step1 && step1.npiNumber) {
    const npiExists = await User.findOne({ 'registrationData.step1.npiNumber': step1.npiNumber });
    if (npiExists) {
      res.status(400);
      throw new Error('NPI number already registered');
    }
  }

  // Create user with all registration data
  const user = await User.create({
    email,
    password,
    registrationData: {
      step1,
      step2,
      step3,
      step4,
      step5,
      step6
    },
    registrationSubmittedAt: new Date()
  });

  if (user) {
    generateToken(res, user._id);
    
    res.status(201).json({
      _id: user._id,
      email: user.email,
      registrationCompleted: user.registrationCompleted,
      documentsUploaded: user.documentsUploaded,
      message: 'Registration submitted successfully. Please upload documents.'
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Upload documents
// @route   POST /api/auth/upload-documents
// @access  Private
const uploadDocuments = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update documents
  user.documents = {
    deaLicense: req.body.deaLicense,
    stateLicense: req.body.stateLicense,
    businessLicense: req.body.businessLicense,
    einDocument: req.body.einDocument,
    w9Form: req.body.w9Form,
    voidedCheck: req.body.voidedCheck,
    additionalDoc1: req.body.additionalDoc1,
    additionalDoc2: req.body.additionalDoc2,
    uploadedAt: new Date()
  };

  user.documentsUploaded = true;
  user.registrationCompleted = true;

  const updatedUser = await user.save();

  // Send verification emails
  await sendAdminNotification(updatedUser);
  await sendVerificationEmail(updatedUser);

  res.json({
    _id: updatedUser._id,
    registrationCompleted: updatedUser.registrationCompleted,
    documentsUploaded: updatedUser.documentsUploaded,
    message: 'Documents uploaded successfully. Your account is pending verification.'
  });
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    // Check if user is verified
    if (!user.isVerified || user.verificationStatus !== 'approved') {
      res.status(401);
      throw new Error('Account pending verification. Please wait for admin approval.');
    }

    generateToken(res, user._id);

    res.json({
      _id: user._id,
      email: user.email,
      legalBusinessName: user.registrationData?.step1?.legalBusinessName,
      isVerified: user.isVerified,
      verificationStatus: user.verificationStatus
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get registration status
// @route   GET /api/auth/registration-status
// @access  Private
const getRegistrationStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('registrationCompleted documentsUploaded verificationStatus isVerified');

  if (user) {
    res.json({
      registrationCompleted: user.registrationCompleted,
      documentsUploaded: user.documentsUploaded,
      verificationStatus: user.verificationStatus,
      isVerified: user.isVerified
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  registerUser,
  uploadDocuments,
  loginUser,
  logoutUser,
  getUserProfile,
  getRegistrationStatus
};