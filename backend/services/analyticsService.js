const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

class AnalyticsService {
    parseCSV(filePath) {
        return new Promise((resolve, reject) => {
            const results = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', (err) => reject(err));
        });
    }

    async getFuelConsumptionData(data = null) {
        if (!data) {
            const filePath = path.join(__dirname, '..', 'data', 'trucks_data.csv');
            if (fs.existsSync(filePath)) {
                data = await this.parseCSV(filePath);
            } else {
                data = this.generateSampleFuelData();
            }
        }

        const monthlyFuel = {};
        data.forEach((row) => {
            const month = row.date ? row.date.substring(0, 7) : 'Unknown';
            if (!monthlyFuel[month]) monthlyFuel[month] = 0;
            monthlyFuel[month] += parseFloat(row.fuel_used_liters || 0);
        });

        return Object.entries(monthlyFuel).map(([month, total]) => ({
            month,
            fuelConsumed: parseFloat(total.toFixed(2)),
        }));
    }

    async getMaintenanceCostData(data = null) {
        if (!data) {
            data = this.generateSampleMaintenanceData();
        }

        const monthlyCost = {};
        data.forEach((row) => {
            const month = row.date ? row.date.substring(0, 7) : row.month || 'Unknown';
            if (!monthlyCost[month]) monthlyCost[month] = 0;
            monthlyCost[month] += parseFloat(row.cost_rs || row.cost || 0);
        });

        return Object.entries(monthlyCost).map(([month, cost]) => ({
            month,
            cost: parseFloat(cost.toFixed(2)),
        }));
    }

    async getCO2EmissionsData(data = null) {
        if (!data) {
            const filePath = path.join(__dirname, '..', 'data', 'trucks_data.csv');
            if (fs.existsSync(filePath)) {
                data = await this.parseCSV(filePath);
            } else {
                data = this.generateSampleFuelData();
            }
        }

        const monthlyCO2 = {};
        data.forEach((row) => {
            const month = row.date ? row.date.substring(0, 7) : 'Unknown';
            if (!monthlyCO2[month]) monthlyCO2[month] = 0;
            monthlyCO2[month] += parseFloat(row.co2_kg || 0);
        });

        return Object.entries(monthlyCO2).map(([month, co2]) => ({
            month,
            co2: parseFloat(co2.toFixed(2)),
        }));
    }

    async getDeliveryTimeData(data = null) {
        if (!data) {
            const filePath = path.join(__dirname, '..', 'data', 'trucks_data.csv');
            if (fs.existsSync(filePath)) {
                data = await this.parseCSV(filePath);
            } else {
                data = this.generateSampleFuelData();
            }
        }

        const monthlyTime = {};
        const monthlyCount = {};
        data.forEach((row) => {
            const month = row.date ? row.date.substring(0, 7) : 'Unknown';
            if (!monthlyTime[month]) { monthlyTime[month] = 0; monthlyCount[month] = 0; }
            monthlyTime[month] += parseFloat(row.delivery_time_min || 0);
            monthlyCount[month] += 1;
        });

        return Object.entries(monthlyTime).map(([month, total]) => ({
            month,
            avgDeliveryTime: parseFloat((total / (monthlyCount[month] || 1)).toFixed(2)),
        }));
    }

    async getTrafficImpactData(data = null) {
        if (!data) {
            const filePath = path.join(__dirname, '..', 'data', 'traffic_data.csv');
            if (fs.existsSync(filePath)) {
                data = await this.parseCSV(filePath);
            } else {
                data = this.generateSampleTrafficData();
            }
        }

        const trafficCounts = { Low: 0, Medium: 0, High: 0 };
        data.forEach((row) => {
            const level = row.congestion_level || 'Low';
            if (trafficCounts[level] !== undefined) trafficCounts[level] += 1;
        });

        return Object.entries(trafficCounts).map(([name, value]) => ({ name, value }));
    }

    async getDashboardStats() {
        const Truck = require('../models/Truck');
        const Route = require('../models/Route');
        const Maintenance = require('../models/Maintenance');

        const [totalTrucks, activeTrucks, totalRoutes, overdueCount] = await Promise.all([
            Truck.countDocuments(),
            Truck.countDocuments({ status: 'active' }),
            Route.countDocuments(),
            Maintenance.countDocuments({ nextServiceDue: { $lt: new Date() }, status: { $ne: 'completed' } }),
        ]);

        return { totalTrucks, activeTrucks, totalRoutes, maintenanceAlerts: overdueCount };
    }

    generateSampleFuelData() {
        const data = [];
        for (let i = 0; i < 50; i++) {
            data.push({
                date: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
                fuel_used_liters: (Math.random() * 100 + 20).toFixed(2),
                co2_kg: (Math.random() * 250 + 50).toFixed(2),
                delivery_time_min: (Math.random() * 300 + 60).toFixed(0),
                cost_rs: (Math.random() * 10000 + 2000).toFixed(2),
            });
        }
        return data;
    }

    generateSampleMaintenanceData() {
        const data = [];
        const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',
            '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'];
        months.forEach((month) => {
            data.push({ month, cost: (Math.random() * 50000 + 10000).toFixed(2) });
        });
        return data;
    }

    generateSampleTrafficData() {
        const data = [];
        const levels = ['Low', 'Medium', 'High'];
        for (let i = 0; i < 50; i++) {
            data.push({ congestion_level: levels[Math.floor(Math.random() * 3)] });
        }
        return data;
    }
}

module.exports = new AnalyticsService();
