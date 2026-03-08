const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { auth } = require('../middleware/auth');

router.use(auth);

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/fuel', analyticsController.getFuelConsumption);
router.get('/maintenance-cost', analyticsController.getMaintenanceCost);
router.get('/co2', analyticsController.getCO2Emissions);
router.get('/delivery-time', analyticsController.getDeliveryTime);
router.get('/traffic', analyticsController.getTrafficImpact);
router.post('/upload', analyticsController.upload.single('csvFile'), analyticsController.uploadCSV);

module.exports = router;
