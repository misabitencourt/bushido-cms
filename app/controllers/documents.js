const docSrv = require('../services/documents');

module.exports = app => {
    app.get('/cms/documents/id/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        docSrv.findById(id).then(doc => res.json(doc));
    });

    app.get('/documents/id/:id/download', (req, res) => {
        const id = req.originalUrl.split('/').reverse()[1];
        docSrv.findById(id).then(doc => {
            const pdf = Buffer.from(doc.doc.split(',').pop(), 'base64')
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Length': pdf.length
            });
            res.end(pdf);
        });
    });

    app.get('/cms/doc', (req, res) => {
        docSrv.retrieve('').then(documents => {
            return res.json(documents.map(doc => ({
                id: doc.id,
                name: doc.name,
                description: doc.description,
                group: doc.group
            })));
        });
    });

    app.get('/cms/documents', (req, res) => {
        docSrv.retrieve('').then(documents => {
            return res.json(documents.map(doc => ({
                id: doc.id,
                name: doc.name,
                description: doc.description,
                group: doc.group
            })));
        });
    });

    app.get('/cms/documents/:search', (req, res) => {
        const search = req.originalUrl.split('/').pop();
        docSrv.retrieve(search).then(documents => {
            return res.json(documents.map(doc => ({
                id: doc.id,
                name: doc.name,
                description: doc.description,
                group: doc.group
            })));
        });
    });

    app.post('/cms/documents/', (req, res) => {                
        docSrv.create({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            data: req.body.doc
        }).then(doc => {
            return res.json(doc);
        });
    });

    app.put('/cms/documents/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        docSrv.update({
            id,
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            data: req.body.doc
        }).then(doc => {
            return res.json(doc);
        });
    });

    app.delete('/cms/documents/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        if (isNaN(id)) {
            return res.status(400);
        }
        docSrv.destroy(id).then(() => {
            return res.json({ok: true});
        });
    });
}