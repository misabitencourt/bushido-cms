const coverSrv = require('../services/covers');

module.exports = app => {
    app.get('/cms/cover/id/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        coverSrv.findById(id).then(cover => res.json(cover));
    });

    app.get('/cover/id/:id/image', (req, res) => {
        const id = req.originalUrl.split('/').reverse()[1];
        coverSrv.findById(id).then(cover => {
            const img = Buffer.from(cover.cover.split(',').pop(), 'base64')
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': img.length
            });
            res.end(img);
        });
    });

    app.get('/cms/cover', (req, res) => {
        coverSrv.retrieve('').then(comvers => {
            return res.json(comvers.map(cover => ({
                id: cover.id,
                name: cover.name,
                description: cover.description,
                group: cover.group
            })));
        });
    });

    app.get('/cms/cover/:search', (req, res) => {
        const search = req.originalUrl.split('/').pop();
        coverSrv.retrieve(search).then(comvers => {
            return res.json(comvers.map(cover => ({
                id: cover.id,
                name: cover.name,
                description: cover.description,
                group: cover.group
            })));
        });
    });

    app.post('/cms/cover/', (req, res) => {                
        coverSrv.create({
            name: req.body.name,
            description: req.body.description,
            group: req.body.group,
            cover: req.body.cover
        }).then(cover => {
            return res.json(cover);
        });
    });

    app.put('/cms/cover/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        coverSrv.update({
            id,
            name: req.body.name,
            description: req.body.description,
            group: req.body.group,
            cover: req.body.cover
        }).then(cover => {
            return res.json(cover);
        });
    });

    app.delete('/cms/cover/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        if (isNaN(id)) {
            return res.status(400);
        }
        coverSrv.destroy(id).then(() => {
            return res.json({ok: true});
        });
    });
}