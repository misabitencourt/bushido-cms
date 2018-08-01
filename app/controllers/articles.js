const articleSrv = require('../services/articles');

module.exports = app => {
    app.get('/cms/article', (req, res) => {
        articleSrv.retrieve('').then(articles => {
            console.log(articles);
            return res.json(articles.map(article => ({
                id: article.id,
                title: article.title,
                description: article.description,
                menu: {
                    id: article.menu,
                    name: article.menuName
                },
                text: article.text
            })));
        });
    });

    app.get('/cms/article/:search', (req, res) => {
        const search = req.originalUrl.split('/').pop();
        articleSrv.retrieve(search).then(articles => {
            return res.json(articles.map(article => ({
                id: article.id,
                title: article.title,
                description: article.description,
                menu: {
                    id: article.menu,
                    name: article.menuName
                },
                text: article.text
            })));
        });
    });

    app.post('/cms/article/', (req, res) => {        
        articleSrv.create({
            title: req.body.title,
            description: req.body.description,
            menu: req.body.menu,
            text: req.body.text
        }).then(article => {
            return res.json(article);
        });
    });

    app.post('/cms/article/validate', (req, res) => {        
        articleSrv.validate(req.body).then(errors => {
            if (errors.length) {
                return res.status(412).json(errors);
            }

            return res.json([]);
        });
    });

    app.put('/cms/article/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        articleSrv.update({
            id: req.body.id,
            title: req.body.title,
            description: req.body.description,
            menu: req.body.menu,
            text: req.body.text
        }).then(article => {
            return res.json(article);
        });
    });

    app.delete('/cms/article/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        if (isNaN(id)) {
            return res.status(400);
        }
        articleSrv.destroy(id).then(() => {
            return res.json({ok: true});
        });
    });
}