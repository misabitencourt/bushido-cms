const macroSrv = require('../services/macros');

module.exports = app => {
    app.get('/cms/macros', (req, res) => {
        macroSrv.retrieve('').then(macros => {
            return res.json(macros.map(macro => ({
                id: macro.id,
                name: macro.name,
                description: macro.description,
                strval: macro.strval,
                textval: macro.textval,
                type: macro.type
            })));
        });
    });

    app.get('/cms/macros/:search', (req, res) => {
        const search = req.originalUrl.split('/').pop();
        macroSrv.retrieve(search).then(macros => {
            return res.json(macros.map(macro => ({
                id: macro.id,
                name: macro.name,
                description: macro.description,
                strval: macro.strval,
                textval: macro.textval,
                type: macro.type
            })));
        });
    });

    app.post('/cms/macros/', (req, res) => {        
        macroSrv.create({
            name: req.body.name || '',
            description: req.body.description || '',
            strval: req.body.strval || '',
            textval: req.body.textval || '',
            type: req.body.type || '1'
        }).then(macro => {
            return res.json(macro);
        });
    });

    app.put('/cms/macros/:id', (req, res) => {        
        const id = req.originalUrl.split('/').pop()*1;
        macroSrv.update({
            id: req.body.id,
            name: req.body.name || '',
            description: req.body.description || '',
            strval: req.body.strval || '',
            textval: req.body.textval || '',
            type: req.body.type || '1'
        }).then(macro => {
            return res.json(macro);
        });
    });

    app.delete('/cms/macros/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        if (isNaN(id)) {
            return res.status(400);
        }
        macroSrv.destroy(id).then(() => {
            return res.json({ok: true});
        });
    });
}