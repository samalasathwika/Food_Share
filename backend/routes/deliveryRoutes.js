const express = require('express');
const router = express.Router();
const {
  getPendingDeliveries, acceptDelivery, updateDeliveryStatus, getMyDeliveries, scanQR
} = require('../controllers/deliveryController');
const { protect, authorize } = require('../middleware/auth');

router.get('/pending', protect, authorize('volunteer'), getPendingDeliveries);
router.get('/my', protect, authorize('volunteer'), getMyDeliveries);
router.put('/:id/accept', protect, authorize('volunteer'), acceptDelivery);
router.put('/:id/status', protect, authorize('volunteer'), updateDeliveryStatus);
router.post('/scan-qr', protect, authorize('volunteer'), scanQR);

module.exports = router;
