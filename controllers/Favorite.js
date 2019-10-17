const Favorite = require('../models/Favorite');

exports.getFavorite = (req, res, next) => {
    return Favorite.find({ customerId: req.user._id })
        .populate('musicianId')
        .populate('customerId')
        .then(result => res.status(200).json({ length: result.length, data: result }))
        .catch(error => {
            /* istanbul ignore next */
            return error => res.status(500).json({ message: error.toString() });
        });
};

exports.getFavoriteDetail = (req, res, next) => {
    return Favorite.findById(req.params.id)
        .populate('musicianId')
        .populate('customerId')
        .then(result => res.status(200).json({ data: result }))
        .catch(error => {
            /* istanbul ignore next */
            return error => res.status(500).json({ message: error.toString() });
        });
};

exports.addFavorite = (req, res, next) => {
    const {
        musicianId
    } = req.body;
    const favorite = new Favorite({
        customerId: req.user._id,
        musicianId
    });
    return favorite.save()
        .then(result => res.status(201).json({ message: 'Added to favorite' }))
        .catch(error => {
            /* istanbul ignore next */
            return error => res.status(500).json({ message: error.toString() });
        });
};

exports.deleteFavorite = (req, res, next) => {
    const id = req.params.id;
    return Favorite.findByIdAndDelete({ _id: id }, (error, result) => {
        /* istanbul ignore if */
        if (error) {
            return res.status(500).json({ message: error.toString() });
        }
        return res.status(200).json({ message: 'Favorite removed' });
    });
};
