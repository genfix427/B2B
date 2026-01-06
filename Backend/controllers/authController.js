import asyncHandler from '../middlewares/asyncHandler.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendVerificationEmail, sendAdminNotification } from '../utils/emailService.js';

// @desc    Register new user (Step 1)
// @route   POST /api/auth/register/step1
// @access  Public
const registerStep1 = asyncHandler(async (req, res) => {
  const {
    npiNumber,
    legalBusinessName,
    doingBusinessAs,
    shippingAddress,
    phone,
    fax,
    timezone,
    federalEIN,
    stateTaxID,
    globalLocationNumber,
    isMailingSameAsShipping,
    mailingAddress,
    email,
    password
  } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Check if NPI exists
  const npiExists = await User.findOne({ npiNumber });
  if (npiExists) {
    res.status(400);
    throw new Error('NPI number already registered');
  }

  // Create user with step 1 data
  const user = await User.create({
    npiNumber,
    legalBusinessName,
    doingBusinessAs,
    shippingAddress,
    phone,
    fax,
    timezone,
    federalEIN,
    stateTaxID,
    globalLocationNumber,
    isMailingSameAsShipping,
    mailingAddress: isMailingSameAsShipping ? shippingAddress : mailingAddress,
    email,
    password,
    registrationStep: 1
  });

  if (user) {
    generateToken(res, user._id);
    
    res.status(201).json({
      _id: user._id,
      email: user.email,
      registrationStep: user.registrationStep,
      message: 'Step 1 completed successfully'
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Update registration step
// @route   PUT /api/auth/register/step/:stepNumber
// @access  Private
const updateRegistrationStep = asyncHandler(async (req, res) => {
  const { stepNumber } = req.params;
  const stepData = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update based on step number
  switch (parseInt(stepNumber)) {
    case 2:
      user.owner = stepData;
      break;
    case 3:
      user.primaryContact = stepData;
      break;
    case 4:
      user.licenses = {
        ...stepData,
        deaExpiration: new Date(stepData.deaExpiration),
        stateLicenseExpiration: new Date(stepData.stateLicenseExpiration)
      };
      break;
    case 5:
      user.pharmacyInfo = {
        ...stepData,
        numberOfLocations: parseInt(stepData.numberOfLocations)
      };
      break;
    case 6:
      user.referralInfo = {
        ...stepData,
        acceptedTerms: stepData.acceptedTerms === 'true'
      };
      break;
    case 7:
      user.documents = stepData;
      user.registrationCompleted = true;
      
      // Send verification email to admin
      await sendAdminNotification(user);
      
      // Send confirmation email to user
      await sendVerificationEmail(user);
      break;
    default:
      res.status(400);
      throw new Error('Invalid step number');
  }

  user.registrationStep = parseInt(stepNumber);
  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    registrationStep: updatedUser.registrationStep,
    registrationCompleted: updatedUser.registrationCompleted,
    message: `Step ${stepNumber} completed successfully`
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
      legalBusinessName: user.legalBusinessName,
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

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.email = req.body.email || user.email;
    user.legalBusinessName = req.body.legalBusinessName || user.legalBusinessName;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      email: updatedUser.email,
      legalBusinessName: updatedUser.legalBusinessName,
      message: 'Profile updated successfully'
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Check registration status
// @route   GET /api/auth/registration-status
// @access  Private
const getRegistrationStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('registrationStep registrationCompleted verificationStatus isVerified');

  if (user) {
    res.json({
      registrationStep: user.registrationStep,
      registrationCompleted: user.registrationCompleted,
      verificationStatus: user.verificationStatus,
      isVerified: user.isVerified
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  registerStep1,
  updateRegistrationStep,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getRegistrationStatus
};