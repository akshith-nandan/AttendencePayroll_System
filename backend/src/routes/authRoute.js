const express = require('express');
const router = express.Router();

const { register,login,getMe } = require('../controllers/auth');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register',register);
router.post('/login',login);
router.get('/getMe',protect,getMe);


module.exports = router;
