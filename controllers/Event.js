const mongoose = require('mongoose');
const moment = require('moment');

const Event = require('../models/Event');
const User = require('../models/User');
const {
    sendFcmMessageToUser
} = require('../services/pushNotification');

exports.getEvent = (req, res, next) => {
    const {
        category,
        musicianId,
        customerId,
        dateEvent,
        status
    } = req.query;
    let query = {};
    /* istanbul ignore else */
    if (dateEvent) {
        query = { dateEvent: { $gte: moment(dateEvent).startOf('day').toDate(), $lte: moment(dateEvent).endOf('day').toDate() }, status };
    } else if (musicianId) {
        query = { musicianId: mongoose.mongo.ObjectId(musicianId) };
    } else if (customerId) {
        query = { customerId: mongoose.mongo.ObjectId(customerId) };
    }
    /* istanbul ignore if */
    if (dateEvent && musicianId) {
        query = { musicianId: mongoose.mongo.ObjectId(musicianId), dateEvent: { $gte: moment(dateEvent).startOf('day').toDate(), $lte: moment(dateEvent).endOf('day').toDate() }, status };
    }
    /* istanbul ignore if */
    if (dateEvent && customerId) {
        query = { customerId: mongoose.mongo.ObjectId(customerId), dateEvent: { $gte: moment(dateEvent).startOf('day').toDate(), $lte: moment(dateEvent).endOf('day').toDate() }, status };
    }
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
        .then(async result => {
            const musician = await User.findById(musicianId);
            if (musician._id && musician.fcmToken) {
                // sendFcmMessageToUser({
                //     title: 'You just got new event',
                //     body: 'Tap this notification to get detail about it',
                //     token: musician.fcmToken
                // });
            }
            return res.status(201).json({ message: 'Event Added' });
        })
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

exports.setEventStatus = (req, res, next) => {
    const musicianId = req.user._id;
    const id = req.params.id;
    const status = req.body.status;
    return Event.findByIdAndUpdate({ _id: id }, { $set: { status } }, async (error, result) => {
        /* istanbul ignore next */
        if (error) {
            return res.status(500).json({ message: error.toString() });
        }
        const customer = await User.findById(result.customerId);
        if (customer._id && customer.fcmToken) {
            sendFcmMessageToUser({
                title: 'Your updated event',
                body: 'Tap this notification to get detail about it',
                token: customer.fcmToken
            });
        }
        return res.status(200).json({ message: `Event set to ${status}` });
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
