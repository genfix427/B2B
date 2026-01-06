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
      mailingAddress: Object
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

  // Documents (uploaded separately)
  documents: {
    deaLicense: String,
    stateLicense: String,
    businessLicense: String,
    einDocument: String,
    w9Form: String,
    voidedCheck: String,
    additionalDoc1: String,
    additionalDoc2: String,
    uploadedAt: Date
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
  }
}, {
  timestamps: true
});

// Hash password before saving
pharmacySchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
pharmacySchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', pharmacySchema);

export default User;