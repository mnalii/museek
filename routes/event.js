const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const customer = require('../middleware/customer');

const {
    addEvent,
    deleteEvent,
    getEvent,
    getEventDetail,
    updateEvent
} = require('../controllers/Event');

router.get('/', getEvent);
router.get('/:id', getEventDetail);
router.post('/', auth, customer, addEvent);
router.put('/:id', auth, customer, updateEvent);
router.delete('/:id', auth, customer, deleteEvent);

module.exports = router;
