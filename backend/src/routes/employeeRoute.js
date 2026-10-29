const express = require('express');
const router = express.Router();

const { createEmployee,getEmployees,getEmployeeById,updateEmployee,deactivateEmployee } = require('../controllers/employee');

const { protect } = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.use(protect,adminMiddleware);

router.post('/',createEmployee);
router.get('/',getEmployees);
router.get('/:id',getEmployeeById);
router.put('/:id',updateEmployee);
router.patch('/:id/deactivate',deactivateEmployee);

module.exports = router;
