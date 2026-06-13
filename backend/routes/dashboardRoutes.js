const express = require('express');
const router = express.Router();
const { getPublicStats } = require('../controllers/dashboardController');

router.get('/stats', getPublicStats);

module.exports = router;
