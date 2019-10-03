const mongoose = require('mongoose');

const Event = require('../models/Event');

exports.getEvent = (req, res, next) => {
    const {
        category,
        musicianId,
        customerId,
        dateEvent,
        location
    } = req.query;
    let query = {};
    return Event.find(query)
        .then(result => {
            return res.status(200).json({
                data: result,
                length: result.length
            });
        })
        .catch(error => res.status(500).json({ message: error }));
};

exports.getEventDetail = (req, res, next) => {
    const id = req.params.id;
    return Event.findById(id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ message: 'Event not found' });
            }
            return res.status(200).json({ data: result });
        })
        .catch(error => res.status(500).json({ message: error }));
};

exports.addEvent = (req, res, next) => {
    const customerId = req.user._id;
    const {
        category,
        musicianId,
        dateEvent,
        duration,
        location
    } = req.body;
    const event = new Event({
        category,
        musicianId,
        customerId,
        dateEvent,
        duration,
        location
    });
    return event.save()
        .then(result => res.status(201).json({ message: 'Event Added' }))
        .catch(error => res.status(500).json({ message: error }));
};

exports.updateEvent = (req, res, next) => {
    const customerId = req.user._id;
    const id = req.params.id;
    return res.status(200).json({ message: 'Event updated' });
};

exports.deleteEvent = (req, res, next) => {
    const customerId = req.user._id;
    const id = req.params.id;
    return Event.findByIdAndDelete({ _id: mongoose.mongo.ObjectId(id), customerId: mongoose.mongo.ObjectId(customerId) }, (error, result) => {
        if (error) {
            return res.status(500).json({ message: error });
        }
        return res.status(200).json({ message: 'Event canceled' });
    });
};
