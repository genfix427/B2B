import express from 'express';
import {
  getPendingVendors,
  getAllVendors,
  getVendorById,
  updateVendorVerification,
  getDashboardStats
} from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/vendors/pending', getPendingVendors);
router.get('/vendors', getAllVendors);
router.get('/vendors/:id', getVendorById);
router.put('/vendors/:id/verify', updateVendorVerification);
router.get('/dashboard/stats', getDashboardStats);

export default router;