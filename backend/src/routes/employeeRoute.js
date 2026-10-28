const express = require('express');
const router = express.Router();

const { createEmployee,getEmployees,getEmployeeById,updateEmployee,deactivateEmployee } = require('../controllers/employee');

const { protect } = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.use(protect,adminMiddleware);

router.post('/createEmployee',createEmployee);
router.get('/getEmployees',getEmployees);
router.get('/getEmployeeById',getEmployeeById);
router.put('/updateEmployee',updateEmployee);
router.patch('/deativeEmployee',deactivateEmployee);

module.exports = router;
