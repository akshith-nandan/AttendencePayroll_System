const express = require('express');
const router = express.Router();
const {
    checkIn,
    checkOut
} = require('../controllers/attendence');


router.post('/checkIn',checkIn);

router.post('/checkOut',checkOut);

module.exports = router;