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
        .populate('musicianId')
        .populate('customerId')
        .then(result => {
            return res.status(200).json({
                data: result,
                length: result.length
            });
        })
        .catch(error => {
            /* istanbul ignore next */
            return res.status(500).json({ message: error });
        });
};

exports.getEventDetail = (req, res, next) => {
    const id = req.params.id;
    return Event.findById(id)
        .populate('musicianId')
        .populate('customerId')
        .then(result => {
            /* istanbul ignore if */
            if (!result) {
                return res.status(404).json({ message: 'Event not found' });
            }
            return res.status(200).json({ data: result });
        })
        .catch(error => {
            /* istanbul ignore next */
            return res.status(500).json({ message: error });
        });
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
        .catch(error => {
            /* istanbul ignore next */
            return res.status(500).json({ message: error });
        });
};

exports.updateEvent = (req, res, next) => {
    const customerId = req.user._id;
    const id = req.params.id;
    const {
        category,
        musicianId,
        dateEvent,
        duration,
        location
    } = req.body;
    const event = new Event({
        _id: id,
        category,
        musicianId,
        customerId,
        dateEvent,
        duration,
        location
    });
    return Event.findOneAndUpdate({ _id: id }, event, (error, result) => {
        /* istanbul ignore next */
        if (error) {
            return res.status(500).json({ message: error.toString() });
        }
        return res.status(200).json({ message: 'Event updated' });
    });
};

exports.deleteEvent = (req, res, next) => {
    const customerId = req.user._id;
    const id = req.params.id;
    return Event.findByIdAndDelete({ _id: mongoose.mongo.ObjectId(id), customerId: mongoose.mongo.ObjectId(customerId) }, (error, result) => {
        /* istanbul ignore next */
        if (error) {
            return res.status(500).json({ message: error });
        }
        return res.status(200).json({ message: 'Event canceled' });
    });
};
