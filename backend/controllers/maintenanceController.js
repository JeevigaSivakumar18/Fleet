const maintenanceService = require('../services/maintenanceService');

exports.getAllRecords = async (req, res, next) => {
    try {
        const records = await maintenanceService.getAllRecords();
        res.json(records);
    } catch (error) {
        next(error);
    }
};

exports.getRecordById = async (req, res, next) => {
    try {
        const record = await maintenanceService.getRecordById(req.params.id);
        res.json(record);
    } catch (error) {
        next(error);
    }
};

exports.createRecord = async (req, res, next) => {
    try {
        const record = await maintenanceService.createRecord(req.body);
        res.status(201).json({ message: 'Maintenance record created', record });
    } catch (error) {
        next(error);
    }
};

exports.updateRecord = async (req, res, next) => {
    try {
        const record = await maintenanceService.updateRecord(req.params.id, req.body);
        res.json({ message: 'Maintenance record updated', record });
    } catch (error) {
        next(error);
    }
};

exports.deleteRecord = async (req, res, next) => {
    try {
        await maintenanceService.deleteRecord(req.params.id);
        res.json({ message: 'Maintenance record deleted' });
    } catch (error) {
        next(error);
    }
};

exports.getOverdueRecords = async (req, res, next) => {
    try {
        const records = await maintenanceService.getOverdueRecords();
        res.json(records);
    } catch (error) {
        next(error);
    }
};

exports.getUpcoming = async (req, res, next) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const records = await maintenanceService.getUpcomingMaintenance(days);
        res.json(records);
    } catch (error) {
        next(error);
    }
};
