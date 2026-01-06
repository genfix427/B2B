import express from 'express';
import {
  getPendingVendors,
  getAllVendors,
  getVendorById,
  updateVendorVerification,
  updateVendorStatus,
  reviewVendorDocuments,
  getDashboardStats,
  getRecentActivities
} from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/vendors/pending', getPendingVendors);
router.get('/vendors', getAllVendors);
router.get('/vendors/:id', getVendorById);
router.put('/vendors/:id/verify', updateVendorVerification);
router.put('/vendors/:id/status', updateVendorStatus);
router.put('/vendors/:id/documents', reviewVendorDocuments);
router.get('/dashboard/stats', getDashboardStats);
router.get('/activities', getRecentActivities);

export default router;