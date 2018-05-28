const userSrv = require('../services/users');

module.exports = app => {
    app.post('/cms/login', (req, res) => {
        userSrv.login(req.body).then(user => {
            if (! user) {
                return res.status(403).json({error: 'INVALID_AUTH'});
            }
            
            res.json(user);
        });
    });
}