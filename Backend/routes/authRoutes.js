import express from 'express';
import {
  registerUser,
  uploadDocuments,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateProfile,
  uploadDocumentsProfile,
  getRegistrationStatus
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadDocuments as uploadMiddleware } from '../utils/fileUpload.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);
router.get('/registration-status', protect, getRegistrationStatus);

// Document upload routes
router.post('/upload-documents', protect, uploadMiddleware, async (req, res) => {
  try {
    const documentData = {};
    
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
    
    req.body = documentData;
    
    const controller = await import('../controllers/authController.js');
    return controller.uploadDocuments(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/upload-documents-profile', protect, uploadMiddleware, async (req, res) => {
  try {
    const documentData = {};
    
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
    
    req.body = documentData;
    
    const controller = await import('../controllers/authController.js');
    return controller.uploadDocumentsProfile(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;