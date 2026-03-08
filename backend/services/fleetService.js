const Truck = require('../models/Truck');

class FleetService {
    async getAllTrucks() {
        return Truck.find().sort({ createdAt: -1 });
    }

    async getTruckById(id) {
        const truck = await Truck.findById(id);
        if (!truck) throw Object.assign(new Error('Truck not found'), { status: 404 });
        return truck;
    }

    async createTruck(data) {
        const truck = new Truck(data);
        return truck.save();
    }

    async updateTruck(id, data) {
        const truck = await Truck.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!truck) throw Object.assign(new Error('Truck not found'), { status: 404 });
        return truck;
    }

    async deleteTruck(id) {
        const truck = await Truck.findByIdAndDelete(id);
        if (!truck) throw Object.assign(new Error('Truck not found'), { status: 404 });
        return truck;
    }

    async assignDriver(id, driverName) {
        return this.updateTruck(id, { driverName });
    }

    async getActiveTrucks() {
        return Truck.find({ status: 'active' });
    }
}

module.exports = new FleetService();
