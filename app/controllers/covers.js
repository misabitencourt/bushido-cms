const coverSrv = require('../services/covers');

module.exports = app => {
    app.get('/cms/cover/id/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        coverSrv.findById(id).then(cover => res.json(cover));
    });

    app.get('/cms/cover', (req, res) => {
        coverSrv.retrieve('').then(news => {
            return res.json(news.map(cover => ({
                id: cover.id,
                title: cover.title,
                description: cover.description,
                group: cover.group
            })));
        });
    });

    app.get('/cms/cover/:search', (req, res) => {
        const search = req.originalUrl.split('/').pop();
        coverSrv.retrieve(search).then(news => {
            return res.json(news.map(neww => ({
                id: cover.id,
                title: cover.title,
                description: cover.description,
                group: cover.group
            })));
        });
    });

    app.post('/cms/cover/', (req, res) => {                
        coverSrv.create({
            id: req.body.id,
            title: req.body.title,
            description: req.body.description,
            group: req.body.group,
            cover: req.body.cover
        }).then(neww => {
            return res.json(neww);
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
        }).then(neww => {
            return res.json(neww);
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