const Route = require('../models/Route');
const Truck = require('../models/Truck');

class RouteService {
    calculateFuelConsumed(distanceKm, fuelEfficiency) {
        return parseFloat((distanceKm / fuelEfficiency).toFixed(2));
    }

    calculateFuelCost(fuelConsumed, costPerLitre) {
        return parseFloat((fuelConsumed * costPerLitre).toFixed(2));
    }

    calculateCarbonEmission(fuelConsumed, emissionFactor) {
        return parseFloat((fuelConsumed * emissionFactor).toFixed(2));
    }

    determineTrafficLevel(durationInTraffic, normalDuration) {
        if (!durationInTraffic || !normalDuration) {
            const levels = ['Low', 'Medium', 'High'];
            return levels[Math.floor(Math.random() * 3)];
        }
        const ratio = durationInTraffic / normalDuration;
        if (ratio < 1.2) return 'Low';
        if (ratio < 1.5) return 'Medium';
        return 'High';
    }

    async planRoute(data) {
        const { source, destination, truckId, distance, duration, polyline } = data;

        let truck = null;
        let fuelEfficiency = 8;
        let costPerLitre = 95;
        let emissionFactor = 2.68;

        if (truckId) {
            truck = await Truck.findById(truckId);
            if (truck) {
                fuelEfficiency = truck.fuelEfficiency;
                costPerLitre = truck.costPerLitre;
                emissionFactor = truck.emissionFactor;
            }
        }

        const distanceKm = distance || Math.floor(Math.random() * 500) + 50;
        const fuelConsumed = this.calculateFuelConsumed(distanceKm, fuelEfficiency);
        const fuelCost = this.calculateFuelCost(fuelConsumed, costPerLitre);
        const carbonEmission = this.calculateCarbonEmission(fuelConsumed, emissionFactor);
        const trafficLevel = this.determineTrafficLevel(null, null);

        const route = new Route({
            truckId: truckId || null,
            source,
            destination,
            distance: distanceKm,
            duration: duration || `${Math.floor(distanceKm / 60)} hrs ${Math.floor(Math.random() * 60)} min`,
            fuelConsumed,
            fuelCost,
            carbonEmission,
            trafficLevel,
            polyline: polyline || '',
        });

        return route.save();
    }

    async getAllRoutes() {
        return Route.find().populate('truckId').sort({ createdAt: -1 });
    }

    async getRouteById(id) {
        const route = await Route.findById(id).populate('truckId');
        if (!route) throw Object.assign(new Error('Route not found'), { status: 404 });
        return route;
    }

    async deleteRoute(id) {
        const route = await Route.findByIdAndDelete(id);
        if (!route) throw Object.assign(new Error('Route not found'), { status: 404 });
        return route;
    }
}

module.exports = new RouteService();
