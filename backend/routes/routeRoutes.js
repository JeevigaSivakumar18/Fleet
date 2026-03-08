const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { auth } = require('../middleware/auth');
const { validateRoute } = require('../middleware/validator');

router.use(auth);

router.get('/', routeController.getAllRoutes);
router.get('/:id', routeController.getRouteById);
router.post('/', validateRoute, routeController.planRoute);
router.delete('/:id', routeController.deleteRoute);

module.exports = router;
