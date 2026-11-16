const express = require('express');
const router = express.Router();

const { getDailyReport, getWeeklyReport, getMonthlyReport, getEmployeeReport, getMyReport} = require("../controllers/report");

const { protect } = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
 

router.get("/me", protect, getMyReport);
router.get("/daily", protect, adminMiddleware, getDailyReport);
router.get("/weekly", protect, adminMiddleware, getWeeklyReport);
router.get("/monthly", protect, adminMiddleware, getMonthlyReport);
router.get("/employee/:employeeId", protect, adminMiddleware, getEmployeeReport);

module.exports = router;
