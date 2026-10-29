const express = require('express');
const router = express.Router();

const { getSettings,updateSettings } = require('../controllers/settings')

const { protect } = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.use(protect);

router.get('/', getSettings);

router.put('/', adminMiddleware,updateSettings);

module.exports = router;
