module.exports = (req, res, next) => {
    if (req.user.role === 'customer') {
        return next();
    }
    return res.status(401).json({
        message: 'You\'re not authorized'
    });
};
