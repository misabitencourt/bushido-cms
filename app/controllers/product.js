const productSrv = require('../services/products');

module.exports = app => {
    app.get('/cms/product', (req, res) => {
        productSrv.retrieve('').then(products => {
            return res.json(products.map(product => ({
                id: product.id,
                title: product.name,
                description: product.short_description,
                menu: product.long_description,
                photos: product.photos
            })));
        });
    });

    app.get('/cms/product/:search', (req, res) => {
        const search = req.originalUrl.split('/').pop();
        productSrv.retrieve(search).then(products => {
            return res.json(products.map(product => ({
                id: product.id,
                title: product.name,
                description: product.short_description,
                menu: product.long_description,
                protos: product.photos
            })));
        });
    });

    app.post('/cms/product/', (req, res) => {        
        productSrv.create({
            title: req.body.name,
            description: req.body.short_description,
            menu: req.body.long_description,
            photos: req.body.photos || []
        }).then(product => {
            return res.json(product);
        });
    });

    app.post('/cms/product/validate', (req, res) => {        
        productSrv.validate(req.body).then(errors => {
            if (errors.length) {
                return res.status(412).json(errors);
            }

            return res.json([]);
        });
    });

    app.put('/cms/product/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        productSrv.update({
            id: req.body.id,
            title: req.body.name,
            description: req.body.short_description,
            menu: req.body.long_description
        }).then(product => {
            return res.json(product);
        });
    });

    app.delete('/cms/product/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        if (isNaN(id)) {
            return res.status(400);
        }
        productSrv.destroy(id).then(() => {
            return res.json({ok: true});
        });
    });

    app.delete('/cms/product/image/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        if (isNaN(id)) {
            return res.status(400);
        }
        productSrv.destroyImage(id).then(() => {
            return res.json({ok: true});
        });
    });
}