const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    truckId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Truck',
        required: false,
    },
    source: {
        type: String,
        required: [true, 'Source location is required'],
        trim: true,
    },
    destination: {
        type: String,
        required: [true, 'Destination is required'],
        trim: true,
    },
    distance: {
        type: Number,
        default: 0,
        comment: 'in km',
    },
    duration: {
        type: String,
        default: '',
        comment: 'estimated time',
    },
    fuelConsumed: {
        type: Number,
        default: 0,
        comment: 'litres',
    },
    fuelCost: {
        type: Number,
        default: 0,
        comment: 'in currency',
    },
    carbonEmission: {
        type: Number,
        default: 0,
        comment: 'kg CO2',
    },
    trafficLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low',
    },
    polyline: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Route', routeSchema);
