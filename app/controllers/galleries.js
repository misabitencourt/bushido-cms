const gallerySrv = require('../services/galleries');

module.exports = app => {
    app.get('/cms/galleries/id/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        gallerySrv.findById(id).then(product => res.json(product));
    });

    app.get('/cms/galleries', (req, res) => {
        gallerySrv.retrieve('').then(galleries => {
            return res.json(galleries.map(product => ({
                id: product.id,
                name: product.name,
                short_description: product.short_description,
                long_description: product.long_description,
            })));
        });
    });

    app.get('/cms/galleries/:search', (req, res) => {
        const search = req.originalUrl.split('/').pop();
        gallerySrv.retrieve(search).then(galleries => {
            return res.json(galleries.map(product => ({
                id: product.id,
                name: product.name,
                short_description: product.short_description,
                long_description: product.long_description,
            })));
        });
    });

    app.post('/cms/galleries/', (req, res) => {        
        gallerySrv.create({
            name: req.body.name,
            short_description: req.body.short_description,
            long_description: req.body.long_description,
            photos: req.body.photos || [],
        }).then(product => {
            return res.json(product);
        });
    });

    app.post('/cms/galleries/image', (req, res) => {        
        gallerySrv.createImage(req.body.id, req.body.image).then(created => {
            return res.json(created);
        });
    });

    app.post('/cms/galleries/validate', (req, res) => {        
        gallerySrv.validate(req.body).then(errors => {
            if (errors.length) {
                return res.status(412).json(errors);
            }

            return res.json([]);
        });
    });

    app.put('/cms/galleries/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        gallerySrv.update({
            id,
            short_description: req.body.short_description,
            long_description: req.body.long_description,
        }).then(product => {
            return res.json(product);
        });
    });

    app.delete('/cms/galleries/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        if (isNaN(id)) {
            return res.status(400);
        }
        gallerySrv.destroy(id).then(() => {
            return res.json({ok: true});
        });
    });

    app.delete('/cms/galleries/image/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        if (isNaN(id)) {
            return res.status(400);
        }
        gallerySrv.destroyImage(id).then(() => {
            return res.json({ok: true});
        });
    });
}