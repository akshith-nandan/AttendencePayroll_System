const express = require('express');
const router = express.Router();

const { getDailyReport, getWeeklyReport, getMonthlyReport, getEmployeeReport} = require("../controllers/report");

const { protect } = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
 
router.use(protect, adminMiddleware);

router.get("/daily",getDailyReport);
router.get("/weekly",getWeeklyReport);
router.get("/monthly",getMonthlyReport);
router.get("/employee/:employeeId",getEmployeeReport);

module.exports = router;
