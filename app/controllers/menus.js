const menuSrv = require('../services/menus');

module.exports = app => {
    app.get('/cms/menu', (req, res) => {
        menuSrv.retrieve('').then(menus => {
            return res.json(menus.map(menu => ({
                id: menu.id,
                name: menu.name,
                description: menu.description,
                order: menu.order
            })));
        });
    });

    app.get('/cms/menu/:search', (req, res) => {
        const search = req.originalUrl.split('/').pop();
        menuSrv.retrieve(search).then(menus => {
            return res.json(menus.map(menu => ({
                id: menu.id,
                name: menu.name,
                description: menu.description,
                order: menu.order
            })));
        });
    });

    app.post('/cms/menu/', (req, res) => {        
        menuSrv.create({
            name: req.body.name,
            description: req.body.description,
            order: req.body.order || 0
        }).then(menu => {
            return res.json(menu);
        });
    });

    app.put('/cms/menu/:id', (req, res) => {        
        const id = req.originalUrl.split('/').pop()*1;
        menuSrv.update({
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            order: req.body.order || 0
        }).then(menu => {
            return res.json(menu);
        });
    });

    app.delete('/cms/menu/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        if (isNaN(id)) {
            return res.status(400);
        }
        menuSrv.destroy(id).then(() => {
            return res.json({ok: true});
        });
    });
}