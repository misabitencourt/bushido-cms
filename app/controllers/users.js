const userSrv = require('../services/users');

module.exports = app => {
    app.get('/cms/user/:search', (req, res) => {
        const search = req.param.search;
        userSrv.retrieve(search).then(users => {
            return res.json(users);
        });
    });

    app.post('/cms/user/', (req, res) => {
        console.log(req.body);
        userSrv.create(req.body).then(user => {
            return res.json(user);
        });
    });

    app.put('/cms/user/:id', (req, res) => {
        userSrv.update(req.body).then(user => {
            return res.json(user);
        });
    });

    app.delete('/cms/user/:id', (req, res) => {
        userSrv.destroy(req.param.id, () => {
            return res.json({ok: true});
        });
    });
}