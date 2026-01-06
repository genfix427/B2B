import asyncHandler from '../middlewares/asyncHandler.js';
import User from '../models/User.js';
import { sendVerificationResultEmail } from '../utils/emailService.js';

// @desc    Get all pending vendors
// @route   GET /api/admin/vendors/pending
// @access  Private/Admin
const getPendingVendors = asyncHandler(async (req, res) => {
  const vendors = await User.find({
    role: 'vendor',
    registrationCompleted: true,
    verificationStatus: 'pending'
  })
  .select('-password')
  .sort({ createdAt: -1 });

  res.json(vendors);
});

// @desc    Get all vendors
// @route   GET /api/admin/vendors
// @access  Private/Admin
const getAllVendors = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;
  
  let query = { role: 'vendor', registrationCompleted: true };
  
  // Filter by status
  if (status && status !== 'all') {
    query.verificationStatus = status;
  }
  
  // Search functionality
  if (search) {
    query.$or = [
      { 'registrationData.step1.legalBusinessName': { $regex: search, $options: 'i' } },
      { 'registrationData.step1.npiNumber': { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { 'registrationData.step1.phone': { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const vendors = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
  const total = await User.countDocuments(query);
  const totalPages = Math.ceil(total / parseInt(limit));

  res.json({
    vendors,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
});

// @desc    Get vendor by ID
// @route   GET /api/admin/vendors/:id
// @access  Private/Admin
const getVendorById = asyncHandler(async (req, res) => {
  const vendor = await User.findById(req.params.id).select('-password');

  if (vendor && vendor.role === 'vendor') {
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

  if (vendor && vendor.role === 'vendor') {
    vendor.verificationStatus = verificationStatus;
    vendor.verificationNotes = verificationNotes;
    vendor.verifiedBy = req.user._id;
    vendor.verifiedAt = new Date();
    
    if (verificationStatus === 'approved') {
      vendor.isVerified = true;
      vendor.status = 'active';
    } else if (verificationStatus === 'rejected') {
      vendor.isVerified = false;
    }

    const updatedVendor = await vendor.save();

    // Send email notification to vendor
    await sendVerificationResultEmail(updatedVendor, verificationStatus, verificationNotes);

    res.json({
      _id: updatedVendor._id,
      legalBusinessName: updatedVendor.registrationData?.step1?.legalBusinessName,
      verificationStatus: updatedVendor.verificationStatus,
      isVerified: updatedVendor.isVerified,
      message: 'Vendor verification status updated'
    });
  } else {
    res.status(404);
    throw new Error('Vendor not found');
  }
});

// @desc    Update vendor account status
// @route   PUT /api/admin/vendors/:id/status
// @access  Private/Admin
const updateVendorStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  
  const vendor = await User.findById(req.params.id);

  if (vendor && vendor.role === 'vendor') {
    vendor.status = status;
    
    if (notes) {
      vendor.verificationNotes = notes;
    }

    const updatedVendor = await vendor.save();

    res.json({
      _id: updatedVendor._id,
      legalBusinessName: updatedVendor.registrationData?.step1?.legalBusinessName,
      status: updatedVendor.status,
      message: 'Vendor status updated successfully'
    });
  } else {
    res.status(404);
    throw new Error('Vendor not found');
  }
});

// @desc    Review vendor documents
// @route   PUT /api/admin/vendors/:id/documents
// @access  Private/Admin
const reviewVendorDocuments = asyncHandler(async (req, res) => {
  const { status, reviewNotes } = req.body;
  
  const vendor = await User.findById(req.params.id);

  if (vendor && vendor.role === 'vendor') {
    vendor.documents.status = status;
    vendor.documents.reviewNotes = reviewNotes;
    vendor.documents.reviewedBy = req.user._id;
    vendor.documents.reviewedAt = new Date();

    // If documents are approved, auto-verify the vendor
    if (status === 'approved') {
      vendor.verificationStatus = 'approved';
      vendor.isVerified = true;
      vendor.verifiedBy = req.user._id;
      vendor.verifiedAt = new Date();
      
      // Send approval email
      await sendVerificationResultEmail(vendor, 'approved', 'Your documents have been approved.');
    }

    const updatedVendor = await vendor.save();

    res.json({
      _id: updatedVendor._id,
      legalBusinessName: updatedVendor.registrationData?.step1?.legalBusinessName,
      documents: updatedVendor.documents,
      verificationStatus: updatedVendor.verificationStatus,
      message: 'Documents reviewed successfully'
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
  const [
    totalVendors,
    pendingVendors,
    approvedVendors,
    rejectedVendors,
    activeVendors,
    suspendedVendors,
    pendingDocuments,
    newRegistrationsToday
  ] = await Promise.all([
    User.countDocuments({ role: 'vendor', registrationCompleted: true }),
    User.countDocuments({ 
      role: 'vendor',
      registrationCompleted: true,
      verificationStatus: 'pending'
    }),
    User.countDocuments({
      role: 'vendor',
      registrationCompleted: true,
      verificationStatus: 'approved'
    }),
    User.countDocuments({
      role: 'vendor',
      registrationCompleted: true,
      verificationStatus: 'rejected'
    }),
    User.countDocuments({
      role: 'vendor',
      registrationCompleted: true,
      status: 'active'
    }),
    User.countDocuments({
      role: 'vendor',
      registrationCompleted: true,
      status: 'suspended'
    }),
    User.countDocuments({
      role: 'vendor',
      registrationCompleted: true,
      'documents.status': 'pending'
    }),
    User.countDocuments({
      role: 'vendor',
      registrationCompleted: true,
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    })
  ]);

  res.json({
    totalVendors,
    pendingVendors,
    approvedVendors,
    rejectedVendors,
    activeVendors,
    suspendedVendors,
    pendingDocuments,
    newRegistrationsToday
  });
});

// @desc    Get recent activities
// @route   GET /api/admin/activities
// @access  Private/Admin
const getRecentActivities = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.query;
  
  const recentVendors = await User.find({ 
    role: 'vendor',
    registrationCompleted: true 
  })
  .select('-password')
  .sort({ createdAt: -1 })
  .limit(parseInt(limit));

  // Format activities
  const activities = recentVendors.map(vendor => ({
    type: 'registration',
    vendorId: vendor._id,
    vendorName: vendor.registrationData?.step1?.legalBusinessName,
    status: vendor.verificationStatus,
    timestamp: vendor.createdAt,
    action: 'Registered'
  }));

  res.json(activities);
});

export {
  getPendingVendors,
  getAllVendors,
  getVendorById,
  updateVendorVerification,
  updateVendorStatus,
  reviewVendorDocuments,
  getDashboardStats,
  getRecentActivities
};