import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'matchrx/documents',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    resource_type: 'auto',
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and documents are allowed'));
    }
  },
});

// Upload multiple files (for step 7 documents)
const uploadDocuments = upload.fields([
  { name: 'deaLicense', maxCount: 1 },
  { name: 'stateLicense', maxCount: 1 },
  { name: 'businessLicense', maxCount: 1 },
  { name: 'einDocument', maxCount: 1 },
  { name: 'w9Form', maxCount: 1 },
  { name: 'voidedCheck', maxCount: 1 },
  { name: 'additionalDoc1', maxCount: 1 },
  { name: 'additionalDoc2', maxCount: 1 }
]);

export { upload, uploadDocuments };