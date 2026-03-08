const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    truckId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Truck',
        required: [true, 'Truck reference is required'],
    },
    serviceType: {
        type: String,
        required: [true, 'Service type is required'],
        trim: true,
    },
    lastServiceDate: {
        type: Date,
        required: [true, 'Last service date is required'],
    },
    nextServiceDue: {
        type: Date,
        required: [true, 'Next service due date is required'],
    },
    odometer: {
        type: Number,
        required: true,
        min: 0,
    },
    notes: {
        type: String,
        trim: true,
        default: '',
    },
    status: {
        type: String,
        enum: ['completed', 'pending', 'overdue'],
        default: 'pending',
    },
    cost: {
        type: Number,
        default: 0,
        min: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

maintenanceSchema.pre('save', function (next) {
    if (this.nextServiceDue < new Date()) {
        this.status = 'overdue';
    }
    next();
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
