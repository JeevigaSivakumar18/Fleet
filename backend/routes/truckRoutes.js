const express = require('express');
const router = express.Router();
const truckController = require('../controllers/truckController');
const { auth } = require('../middleware/auth');
const { validateTruck } = require('../middleware/validator');

router.use(auth);

router.get('/', truckController.getAllTrucks);
router.get('/:id', truckController.getTruckById);
router.post('/', validateTruck, truckController.createTruck);
router.put('/:id', truckController.updateTruck);
router.delete('/:id', truckController.deleteTruck);
router.patch('/:id/driver', truckController.assignDriver);

module.exports = router;
