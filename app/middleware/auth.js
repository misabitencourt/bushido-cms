const userSrv = require('../services/users')

const public = [
    '/cms/login',
    '/'
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
                return res.status(403).json({error: 'AUTH_REQUIRED'});
            }
            req.currentUser = user;
            
            let resource = url.replace('/cms/', '');
            resource = resource.split('/').reverse().pop();
                        
            let canUseResource = !! (user.acl || '').split(';').find(acl => acl === resource);
            if (! canUseResource) {
                return res.status(403).json({error: 'NOT_AUTHORIZED'});
            }

            next();
        });
    }

    next();
}