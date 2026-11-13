const express = require('express');
const router = express.Router();

const { 
  generatePayroll, 
  getAllPayrolls, 
  getEmployeePayroll, 
  updatePayroll, 
  makePayrollPaid 
} = require('../controllers/payroll');

const { protect } = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.use(protect);
router.use(adminMiddleware);

router.post("/generate", generatePayroll);

router.get("/", getAllPayrolls);

router.get("/employee/:employeeId", getEmployeePayroll);

router.patch("/:id", updatePayroll);

router.patch("/:id/pay", makePayrollPaid);

module.exports = router;
