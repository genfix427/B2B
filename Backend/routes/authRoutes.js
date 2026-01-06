import express from 'express';
import {
  registerStep1,
  updateRegistrationStep,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getRegistrationStatus
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadDocuments } from '../utils/fileUpload.js';

const router = express.Router();

router.post('/register/step1', registerStep1);
router.put('/register/step/:stepNumber', protect, updateRegistrationStep);
router.post('/register/step7', protect, uploadDocuments, async (req, res) => {
  // Handle step 7 document upload
  try {
    const documentData = {};
    
    // Map uploaded files to document fields
    const fileFields = [
      'deaLicense', 'stateLicense', 'businessLicense',
      'einDocument', 'w9Form', 'voidedCheck',
      'additionalDoc1', 'additionalDoc2'
    ];
    
    fileFields.forEach(field => {
      if (req.files[field]) {
        documentData[field] = req.files[field][0].path;
      }
    });
    
    // Call the updateRegistrationStep with step 7 data
    req.body = documentData;
    req.params = { stepNumber: '7' };
    
    const controller = await import('../controllers/authController.js');
    return controller.updateRegistrationStep(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/registration-status', protect, getRegistrationStatus);

export default router;