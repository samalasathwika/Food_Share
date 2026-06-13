const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createDonation, getDonations, getMyDonations,
  getDonationById, updateDonation, deleteDonation, getAllDonationsAdmin
} = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) cb(null, true);
    else cb(new Error('Only image files allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const fs = require('fs');
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

router.get('/', getDonations);
router.get('/my', protect, authorize('donor'), getMyDonations);
router.get('/admin/all', protect, authorize('admin'), getAllDonationsAdmin);
router.get('/:id', getDonationById);
router.post('/', protect, authorize('donor'), upload.single('image'), createDonation);
router.put('/:id', protect, authorize('donor'), updateDonation);
router.delete('/:id', protect, authorize('donor', 'admin'), deleteDonation);

module.exports = router;
