const express = require('express');
const router = express.Router();

const { register,login,getMe,logout } = require('../controllers/auth');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register',register);
router.post('/login',login);
router.get('/Me',protect,getMe);
router.post('/logout', protect, logout);

module.exports = router;
