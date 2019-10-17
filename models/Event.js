const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    musicianId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    dateEvent: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'accepted', 'rejected']
    }
});

module.exports = mongoose.model('Event', eventSchema);
