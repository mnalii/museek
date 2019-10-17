module.exports = (req, res, next) => {
    if (req.user.role === 'musician') {
        return next();
    }
    return res.status(401).json({
        message: 'You\'re not authorized'
    });
};
