const newSrv = require('../services/news');

module.exports = app => {
    app.get('/cms/new/id/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        newSrv.findById(id).then(neww => res.json(neww));
    });

    app.get('/new/id/:id/image', (req, res) => {
        const id = req.originalUrl.split('/').reverse()[1];
        newSrv.findById(id).then(neww => {
            const img = Buffer.from(neww.cover.split(',').pop(), 'base64')
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': img.length
            });
            res.end(img);
        });
    });

    app.get('/cms/new', (req, res) => {
        newSrv.retrieve('').then(news => {
            return res.json(news.map(neww => ({
                id: neww.id,
                title: neww.title,
                description: neww.description,
                menu: neww.menu,
                author: neww.author,
                published_at: neww.published_at
            })));
        });
    });

    app.get('/cms/new/:search', (req, res) => {
        const search = req.originalUrl.split('/').pop();
        newSrv.retrieve(search).then(news => {
            return res.json(news.map(neww => ({
                id: neww.id,
                title: neww.title,
                description: neww.description,
                abstract: neww.abstract,
                text: neww.text,
                menu: neww.menu,
                author: neww.author,
                published_at: neww.published_at
            })));
        });
    });

    app.post('/cms/new/', (req, res) => {        
        newSrv.create({
            title: req.body.title,
            description: req.body.description,
            abstract: req.body.abstract,
            author: req.body.author,
            text: req.body.text,
            cover: req.body.cover,
            menu: req.body.menu,
            published_at: req.body.published_at
        }).then(neww => {
            return res.json(neww);
        });
    });

    app.post('/cms/new/validate', (req, res) => {        
        newSrv.validate(req.body).then(errors => {
            if (errors.length) {
                return res.status(412).json(errors);
            }

            return res.json([]);
        });
    });

    app.put('/cms/new/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        newSrv.update({
            id: id,
            title: req.body.title,
            description: req.body.description,
            abstract: req.body.abstract,
            author: req.body.author,
            text: req.body.text,
            cover: req.body.cover,
            menu: req.body.menu,
            published_at: req.body.published_at
        }).then(neww => {
            return res.json(neww);
        });
    });

    app.delete('/cms/new/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        if (isNaN(id)) {
            return res.status(400);
        }
        newSrv.destroy(id).then(() => {
            return res.json({ok: true});
        });
    });
}