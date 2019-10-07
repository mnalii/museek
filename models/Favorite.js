const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;

const favorite = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    musicianId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
        timestamps: true
    });

module.exports = Model('Favorite', favorite);
