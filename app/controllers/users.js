const userSrv = require('../services/users');

module.exports = app => {
    app.get('/cms/user', (req, res) => {
        userSrv.retrieve('').then(users => {
            return res.json(users.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                acl: user.acl
            })));
        });
    });

    app.get('/cms/user/:search', (req, res) => {
        const search = req.param.search;
        userSrv.retrieve(search).then(users => {
            return res.json(users.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                acl: user.acl
            })));
        });
    });

    app.post('/cms/user/', (req, res) => {
        console.log(req.body);
        userSrv.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            acl: req.body.acl || ''
        }).then(user => {
            return res.json(user);
        });
    });

    app.put('/cms/user/:id', (req, res) => {
        const model = req.body
        model.id = req.params.id
        if (! model.password) {
            delete model.password
        }
        userSrv.update(model).then(user => {
            return res.json(user);
        });
    });

    app.delete('/cms/user/:id', (req, res) => {
        userSrv.destroy(req.params.id).then(() => {
            return res.json({ok: true});
        });
    });
}