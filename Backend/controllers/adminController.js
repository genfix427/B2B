import asyncHandler from '../middlewares/asyncHandler.js';
import User from '../models/User.js';

// @desc    Get all pending vendors
// @route   GET /api/admin/vendors/pending
// @access  Private/Admin
const getPendingVendors = asyncHandler(async (req, res) => {
  const vendors = await User.find({
    registrationCompleted: true,
    verificationStatus: 'pending'
  }).select('-password');

  res.json(vendors);
});

// @desc    Get all vendors
// @route   GET /api/admin/vendors
// @access  Private/Admin
const getAllVendors = asyncHandler(async (req, res) => {
  const { status } = req.query;
  
  let query = { registrationCompleted: true };
  
  if (status) {
    query.verificationStatus = status;
  }

  const vendors = await User.find(query).select('-password');
  
  res.json({
    count: vendors.length,
    vendors
  });
});

// @desc    Get vendor by ID
// @route   GET /api/admin/vendors/:id
// @access  Private/Admin
const getVendorById = asyncHandler(async (req, res) => {
  const vendor = await User.findById(req.params.id).select('-password');

  if (vendor) {
    res.json(vendor);
  } else {
    res.status(404);
    throw new Error('Vendor not found');
  }
});

// @desc    Update vendor verification status
// @route   PUT /api/admin/vendors/:id/verify
// @access  Private/Admin
const updateVendorVerification = asyncHandler(async (req, res) => {
  const { verificationStatus, verificationNotes } = req.body;
  
  const vendor = await User.findById(req.params.id);

  if (vendor) {
    vendor.verificationStatus = verificationStatus;
    vendor.verificationNotes = verificationNotes;
    vendor.verifiedBy = req.user._id;
    vendor.verifiedAt = new Date();
    
    if (verificationStatus === 'approved') {
      vendor.isVerified = true;
    } else {
      vendor.isVerified = false;
    }

    const updatedVendor = await vendor.save();

    res.json({
      _id: updatedVendor._id,
      legalBusinessName: updatedVendor.legalBusinessName,
      verificationStatus: updatedVendor.verificationStatus,
      isVerified: updatedVendor.isVerified,
      message: 'Vendor verification status updated'
    });
  } else {
    res.status(404);
    throw new Error('Vendor not found');
  }
});

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalVendors = await User.countDocuments({ registrationCompleted: true });
  const pendingVendors = await User.countDocuments({ 
    registrationCompleted: true,
    verificationStatus: 'pending'
  });
  const approvedVendors = await User.countDocuments({
    registrationCompleted: true,
    verificationStatus: 'approved'
  });
  const rejectedVendors = await User.countDocuments({
    registrationCompleted: true,
    verificationStatus: 'rejected'
  });

  res.json({
    totalVendors,
    pendingVendors,
    approvedVendors,
    rejectedVendors
  });
});

export {
  getPendingVendors,
  getAllVendors,
  getVendorById,
  updateVendorVerification,
  getDashboardStats
};