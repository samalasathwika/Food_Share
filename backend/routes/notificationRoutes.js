const express = require('express');
const router = express.Router();
const { getMyNotifications, markRead, markAllRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMyNotifications);
router.put('/:id/read', protect, markRead);
router.put('/read-all', protect, markAllRead);

module.exports = router;
