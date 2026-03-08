const fleetService = require('../services/fleetService');

exports.getAllTrucks = async (req, res, next) => {
    try {
        const trucks = await fleetService.getAllTrucks();
        res.json(trucks);
    } catch (error) {
        next(error);
    }
};

exports.getTruckById = async (req, res, next) => {
    try {
        const truck = await fleetService.getTruckById(req.params.id);
        res.json(truck);
    } catch (error) {
        next(error);
    }
};

exports.createTruck = async (req, res, next) => {
    try {
        const truck = await fleetService.createTruck(req.body);
        res.status(201).json({ message: 'Truck created successfully', truck });
    } catch (error) {
        next(error);
    }
};

exports.updateTruck = async (req, res, next) => {
    try {
        const truck = await fleetService.updateTruck(req.params.id, req.body);
        res.json({ message: 'Truck updated successfully', truck });
    } catch (error) {
        next(error);
    }
};

exports.deleteTruck = async (req, res, next) => {
    try {
        await fleetService.deleteTruck(req.params.id);
        res.json({ message: 'Truck deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.assignDriver = async (req, res, next) => {
    try {
        const truck = await fleetService.assignDriver(req.params.id, req.body.driverName);
        res.json({ message: 'Driver assigned successfully', truck });
    } catch (error) {
        next(error);
    }
};
