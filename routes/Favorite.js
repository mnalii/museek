const express = require('express');
const router = express.Router();

const {
    getFavorite,
    addFavorite,
    deleteFavorite,
    getFavoriteDetail
} = require('../controllers/Favorite');
const auth = require('../middleware/auth');
const customer = require('../middleware/customer');

router.get('/', auth, customer, getFavorite);
router.get('/:id', auth, customer, getFavoriteDetail);
router.post('/', auth, customer, addFavorite);
router.delete('/:id', auth, customer, deleteFavorite);

module.exports = router;
