const express = require('express');
const router = express.Router();
const {
  createRequest, getMyRequests, getDonorRequests,
  approveRequest, rejectRequest, getAllRequestsAdmin
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('ngo', 'orphanage', 'oldagehome'), createRequest);
router.get('/my', protect, authorize('ngo', 'orphanage', 'oldagehome'), getMyRequests);
router.get('/donor', protect, authorize('donor'), getDonorRequests);
router.get('/admin/all', protect, authorize('admin'), getAllRequestsAdmin);
router.put('/:id/approve', protect, authorize('donor'), approveRequest);
router.put('/:id/reject', protect, authorize('donor'), rejectRequest);

module.exports = router;
