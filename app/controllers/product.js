const productSrv = require('../services/products');

module.exports = app => {
    app.get('/cms/product/id/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        productSrv.findById(id).then(product => res.json(product));
    });

    app.get('/cms/product', (req, res) => {
        productSrv.retrieve('').then(products => {
            return res.json(products.map(product => ({
                id: product.id,
                name: product.name,
                short_description: product.short_description,
                long_description: product.long_description,
                price: product.price,
                group: product.group
            })));
        });
    });

    app.get('/cms/product/:search', (req, res) => {
        const search = req.originalUrl.split('/').pop();
        productSrv.retrieve(search).then(products => {
            return res.json(products.map(product => ({
                id: product.id,
                name: product.name,
                short_description: product.short_description,
                long_description: product.long_description,
                price: product.price,
                group: product.group
            })));
        });
    });

    app.post('/cms/product/', (req, res) => {        
        productSrv.create({
            name: req.body.name,
            short_description: req.body.short_description,
            long_description: req.body.long_description,
            photos: req.body.photos || [],
            price: req.body.price,
            group: req.body.group
        }).then(product => {
            return res.json(product);
        });
    });

    app.post('/cms/product/image', (req, res) => {        
        productSrv.createImage(req.body.id, req.body.image).then(created => {
            return res.json(created);
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
            id,
            short_description: req.body.short_description,
            long_description: req.body.long_description,
            price: req.body.price,
            group: req.body.group
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