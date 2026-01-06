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



// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt for email:', email);

  // Check if user exists
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    console.log('User not found:', email);
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Check password
  const isPasswordValid = await user.matchPassword(password);

  if (!isPasswordValid) {
    console.log('Invalid password for:', email);
    res.status(401);
    throw new Error('Invalid email or password');
  }

  console.log('Password valid for:', email);

  // For vendors, check if verified
  if (user.role === 'vendor') {
    if (!user.isVerified || user.verificationStatus !== 'approved') {
      console.log('Vendor not verified:', email, 'Status:', user.verificationStatus);
      res.status(401);
      throw new Error('Account pending verification. Please wait for admin approval.');
    }
  }

  // Update login stats WITHOUT calling save() on the instance
  // Use findByIdAndUpdate to avoid middleware issues
  await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        lastLogin: new Date(),
        loginCount: (user.loginCount || 0) + 1
      }
    },
    { new: true, runValidators: false }
  );

  console.log('Login stats updated for:', email);

  // Generate JWT token
  generateToken(res, user._id);

  console.log('Token generated, sending response for:', email);

  // Send response
  res.status(200).json({
    _id: user._id,
    email: user.email,
    role: user.role,
    legalBusinessName: user.registrationData?.step1?.legalBusinessName,
    isVerified: user.isVerified,
    verificationStatus: user.verificationStatus,
    documentsUploaded: user.documentsUploaded,
    message: 'Login successful'
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});


// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Update profile fields
    if (req.body.profile) {
      user.profile = {
        ...user.profile,
        ...req.body.profile,
        updatedAt: new Date()
      };
    }

    // Update basic info
    if (req.body.email) {
      user.email = req.body.email;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      email: updatedUser.email,
      profile: updatedUser.profile,
      message: 'Profile updated successfully'
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Upload documents from profile
// @route   POST /api/auth/upload-documents-profile
// @access  Private
const uploadDocumentsProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update documents
  const documentUpdates = {};
  const fileFields = [
    'deaLicense', 'stateLicense', 'businessLicense',
    'einDocument', 'w9Form', 'voidedCheck',
    'additionalDoc1', 'additionalDoc2'
  ];

  fileFields.forEach(field => {
    if (req.body[field]) {
      documentUpdates[field] = req.body[field];
    }
  });

  user.documents = {
    ...user.documents,
    ...documentUpdates,
    uploadedAt: new Date(),
    status: 'pending'
  };

  user.documentsUploaded = true;

  // If user hasn't completed registration, mark as completed
  if (!user.registrationCompleted) {
    user.registrationCompleted = true;
    user.registrationSubmittedAt = new Date();

    // Send admin notification
    await sendAdminNotification(user);
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    documentsUploaded: updatedUser.documentsUploaded,
    documents: updatedUser.documents,
    registrationCompleted: updatedUser.registrationCompleted,
    message: 'Documents uploaded successfully. Admin will review them.'
  });
});

// @desc    Get registration status
// @route   GET /api/auth/registration-status
// @access  Private
const getRegistrationStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('registrationCompleted documentsUploaded verificationStatus isVerified role');

  if (user) {
    res.json({
      registrationCompleted: user.registrationCompleted,
      documentsUploaded: user.documentsUploaded,
      verificationStatus: user.verificationStatus,
      isVerified: user.isVerified,
      role: user.role
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
  getCurrentUser,
  updateProfile,
  uploadDocumentsProfile,
  getRegistrationStatus,
  getUserProfile
};