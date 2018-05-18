const userSrv = require('../services/users')

const public = [
    '/cms/login'
];

module.exports = function (req, res, next) {
    const url = req.originalUrl;
    const token = req.get('Auth-Token');
    
    if (url.indexOf(public) !== -1) {
        return next();
    }

    if (url.indexOf('/cms') === 0) {
        return userSrv.checkToken(token).then(user => {
            if (! user) {
                return res.status(403);
            }
            req.currentUser = user;
            next();
        });
    }

    next();
}