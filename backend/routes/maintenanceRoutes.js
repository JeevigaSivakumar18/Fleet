const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { auth } = require('../middleware/auth');
const { validateMaintenance } = require('../middleware/validator');

router.use(auth);

router.get('/', maintenanceController.getAllRecords);
router.get('/overdue', maintenanceController.getOverdueRecords);
router.get('/upcoming', maintenanceController.getUpcoming);
router.get('/:id', maintenanceController.getRecordById);
router.post('/', validateMaintenance, maintenanceController.createRecord);
router.put('/:id', maintenanceController.updateRecord);
router.delete('/:id', maintenanceController.deleteRecord);

module.exports = router;
