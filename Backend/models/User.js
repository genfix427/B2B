import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const pharmacySchema = new mongoose.Schema({
  // Combined registration data
  registrationData: {
    // Step 1
    step1: {
      npiNumber: String,
      legalBusinessName: String,
      doingBusinessAs: String,
      shippingAddress: Object,
      phone: String,
      fax: String,
      timezone: String,
      federalEIN: String,
      stateTaxID: String,
      globalLocationNumber: String,
      isMailingSameAsShipping: Boolean,
      mailingAddress: Object,
      email: String
    },
    // Step 2
    step2: {
      owner: Object
    },
    // Step 3
    step3: {
      primaryContact: Object
    },
    // Step 4
    step4: {
      licenses: Object
    },
    // Step 5
    step5: {
      pharmacyInfo: Object
    },
    // Step 6
    step6: {
      referralInfo: Object
    }
  },

  // Authentication
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },

  // Role and permissions
  role: {
    type: String,
    enum: ['vendor', 'admin'],
    default: 'vendor'
  },

  // Documents (uploaded separately)
  documents: {
    deaLicense: { type: String },
    stateLicense: { type: String },
    businessLicense: { type: String },
    einDocument: { type: String },
    w9Form: { type: String },
    voidedCheck: { type: String },
    additionalDoc1: { type: String },
    additionalDoc2: { type: String },
    uploadedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    reviewNotes: String,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date
  },

  // Account Status
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  verificationNotes: String,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,

  // Registration Status
  registrationCompleted: {
    type: Boolean,
    default: false
  },
  registrationSubmittedAt: Date,
  documentsUploaded: {
    type: Boolean,
    default: false
  },

  // Profile
  profile: {
    profileImage: String,
    businessDescription: String,
    website: String,
    yearEstablished: Number,
    averageMonthlyVolume: String,
    specialties: [String],
    additionalNotes: String,
    updatedAt: Date
  },

  // Activity Tracking
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Hash password before saving - FIXED: Handle async properly
// Hash password before saving (CORRECT – modern mongoose)
pharmacySchema.pre('save', async function () {
  // Only hash if password was modified
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// Compare password method
pharmacySchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// REMOVED the updateLoginStats method - we'll handle it in controller

const User = mongoose.model('User', pharmacySchema);

export default User;