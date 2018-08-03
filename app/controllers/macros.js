const menuSrv = require('../services/menus');

module.exports = app => {
    app.get('/cms/macro', (req, res) => {
        menuSrv.retrieve('').then(menus => {
            return res.json(menus.map(macro => ({
                id: macro.id,
                name: macro.name,
                description: macro.description,
                strval: macro.strval,
                textval: macro.textval
            })));
        });
    });

    app.get('/cms/macro/:search', (req, res) => {
        const search = req.originalUrl.split('/').pop();
        menuSrv.retrieve(search).then(menus => {
            return res.json(menus.map(macro => ({
                id: macro.id,
                name: macro.name,
                description: macro.description,
                strval: macro.strval,
                textval: macro.textval
            })));
        });
    });

    app.post('/cms/macro/', (req, res) => {        
        menuSrv.create({
            name: req.body.name,
            description: req.body.description,
            strval: req.body.strval,
            textval: req.body.textval
        }).then(macro => {
            return res.json(macro);
        });
    });

    app.put('/cms/macro/:id', (req, res) => {        
        const id = req.originalUrl.split('/').pop()*1;
        menuSrv.update({
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            strval: req.body.strval,
            textval: req.body.textval
        }).then(macro => {
            return res.json(macro);
        });
    });

    app.delete('/cms/macro/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        if (isNaN(id)) {
            return res.status(400);
        }
        menuSrv.destroy(id).then(() => {
            return res.json({ok: true});
        });
    });
}