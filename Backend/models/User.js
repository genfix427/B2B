import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const pharmacySchema = new mongoose.Schema({
  // Step 1: Pharmacy Information
  npiNumber: {
    type: String,
    required: [true, 'NPI number is required'],
    unique: true,
    trim: true
  },
  legalBusinessName: {
    type: String,
    required: [true, 'Legal business name is required'],
    trim: true
  },
  doingBusinessAs: {
    type: String,
    trim: true
  },
  shippingAddress: {
    address1: {
      type: String,
      required: [true, 'Shipping address 1 is required']
    },
    address2: String,
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      enum: [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
      ]
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required'],
      match: [/^\d{5}(-\d{4})?$/, 'Please enter a valid zip code']
    }
  },
  mailingAddress: {
    address1: {
      type: String,
      required: [true, 'Mailing address 1 is required']
    },
    address2: String,
    city: {
      type: String,
      required: [true, 'Mailing city is required']
    },
    state: {
      type: String,
      required: [true, 'Mailing state is required']
    },
    zipCode: {
      type: String,
      required: [true, 'Mailing zip code is required']
    }
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{3}-\d{3}-\d{4}$/, 'Please enter a valid phone number (XXX-XXX-XXXX)']
  },
  fax: {
    type: String,
    match: [/^\d{3}-\d{3}-\d{4}$/, 'Please enter a valid fax number (XXX-XXX-XXXX)']
  },
  timezone: {
    type: String,
    required: [true, 'Timezone is required'],
    enum: [
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'America/Alaska',
      'America/Hawaii',
      'America/Puerto_Rico'
    ]
  },
  federalEIN: {
    type: String,
    required: [true, 'Federal EIN is required']
  },
  stateTaxID: String,
  globalLocationNumber: {
    type: String,
    required: [true, 'GLN is required']
  },
  isMailingSameAsShipping: {
    type: Boolean,
    default: false
  },

  // Step 2: Pharmacy Owner
  owner: {
    firstName: {
      type: String,
      required: [true, 'Owner first name is required']
    },
    lastName: {
      type: String,
      required: [true, 'Owner last name is required']
    },
    mobile: {
      type: String,
      required: [true, 'Owner mobile number is required'],
      match: [/^\d{3}-\d{3}-\d{4}$/, 'Please enter a valid mobile number']
    },
    email: {
      type: String,
      required: [true, 'Owner email is required'],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    }
  },

  // Step 3: Primary Contact
  primaryContact: {
    title: {
      type: String,
      required: [true, 'Title/Position is required']
    },
    firstName: {
      type: String,
      required: [true, 'First name is required']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required']
    },
    mobile: {
      type: String,
      match: [/^\d{3}-\d{3}-\d{4}$/, 'Please enter a valid mobile number']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    }
  },

  // Step 4: Pharmacy License
  licenses: {
    deaNumber: {
      type: String,
      required: [true, 'DEA number is required']
    },
    deaExpiration: {
      type: Date,
      required: [true, 'DEA expiration date is required']
    },
    stateLicenseNumber: {
      type: String,
      required: [true, 'State license number is required']
    },
    stateLicenseExpiration: {
      type: Date,
      required: [true, 'State license expiration is required']
    }
  },

  // Step 5: Pharmacy Questions
  pharmacyInfo: {
    enterpriseType: {
      type: String,
      required: [true, 'Enterprise type is required'],
      enum: ['Partnership', 'Corporation', 'Sole Proprietor', 'LLC']
    },
    primaryWholesaler: {
      type: String,
      required: [true, 'Primary wholesaler is required'],
      enum: ['AmeriSource-Bergen', 'Cardinal', 'Cencora', 'McKesson', 'Other']
    },
    secondaryWholesaler: String,
    pharmacyType: {
      type: String,
      required: [true, 'Pharmacy type is required'],
      enum: [
        'Retail Pharmacy',
        'Closed Door Pharmacy',
        'Hospital Pharmacy',
        'Repackager',
        'Surgical Center Pharmacy',
        'Clinical Pharmacy',
        'Nursing Home Pharmacy',
        'Long Term Care Pharmacy',
        'Other'
      ]
    },
    pharmacySoftware: {
      type: String,
      required: [true, 'Pharmacy software is required'],
      enum: [
        'Abacus',
        'AdvanceNet Health Solutions, Inc',
        'Apothesoft-Rx',
        'BestRx Pharmacy Solutions',
        'CarePoint',
        'Datascan',
        'Digital Rx',
        'EnterpriseRx by Mckesson',
        'FrameworkLTC',
        'FSI Pharmacy Management System',
        'Health Business Systems (HBS)',
        'Helix Pharmacy System',
        'Liberty Software',
        'Micro Merchant Systems, Inc',
        'New Leaf Rx by KeyCentrix',
        'Outcomes',
        'PDX Pharmacy System',
        'PharmacyRx - Mckesson',
        'Pharmaserv by McKesson',
        'PioneerRX',
        'PKonRx By SRS Pharmacy Systems',
        'PrimeRX',
        'PROscript 2000 by Prodigy Data Systems',
        'QS/1',
        'QuickScript by Cost Effective Computers',
        'Retail Management Solutions',
        'RS Software',
        'Rx3000 Outpatient Pharmacy Management System',
        'RxMaster Pharmacy Systems',
        'ScriptPro',
        'Speed Script and Speed Script LTC',
        'SuiteRx',
        'VIP Pharmacy Systems',
        'Visual Superscript by DDA Enterprises Inc',
        'WinRx by Computer-Rx',
        'Other'
      ]
    },
    hoursOfOperation: {
      type: String,
      required: [true, 'Hours of operation are required']
    },
    numberOfLocations: {
      type: Number,
      required: [true, 'Number of locations is required'],
      min: 1,
      max: 20
    }
  },

  // Step 6: Referral Information
  referralInfo: {
    promoCode: String,
    hearAboutUs: {
      type: String,
      required: [true, 'Please tell us how you heard about us']
    },
    referredBy: String,
    acceptedTerms: {
      type: Boolean,
      required: [true, 'You must accept the terms and conditions'],
      validate: {
        validator: function(v) {
          return v === true;
        },
        message: 'You must accept the terms and conditions'
      }
    }
  },

  // Step 7: Documents
  documents: {
    deaLicense: { type: String, required: true },
    stateLicense: { type: String, required: true },
    businessLicense: { type: String, required: true },
    einDocument: { type: String, required: true },
    w9Form: { type: String, required: true },
    voidedCheck: { type: String, required: true },
    additionalDoc1: String,
    additionalDoc2: String
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
  
  // Account Status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
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

  // Timestamps
  registrationStep: {
    type: Number,
    default: 1,
    min: 1,
    max: 7
  },
  registrationCompleted: {
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