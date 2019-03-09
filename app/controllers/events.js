const eventSrv = require('../services/events');

module.exports = app => {
    app.get('/cms/event/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        eventSrv.findById(id).then(event => res.json(event));
    });

    app.get('/cms/event', (req, res) => {
        eventSrv.retrieve('').then(events => {
            return res.json(events.map(event => ({
                id: event.id,
                description: event.name,
                address: event.address,
                article_id: event.article_id,
                start: new Date(event.start+''),
                end: new Date(event.end+'')
            })));
        });
    });

    app.get('/cms/event/:search', (req, res) => {
        const search = req.originalUrl.split('/').pop();
        eventSrv.retrieve(search).then(events => {
            return res.json(events.map(event => ({
                id: event.id,
                description: event.name,
                address: event.address,
                article_id: event.article_id,
                start: new Date(event.start+''),
                end: new Date(event.end+'')
            })));
        });
    });

    app.get('/cms/event/date-range/:start/:end', (req, res) => {
        const parameters = req.originalUrl.split('/');
        const end = new Date(decodeURIComponent(parameters.pop()));
        const start = new Date(decodeURIComponent(parameters.pop()));
        eventSrv.findByDateRange(start, end).then(events => {
            return res.json(events.map(event => {
                const start = new Date();
                const end = new Date();
                start.setTime(event.start);
                end.setTime(event.start);
                return {
                    id: event.id,
                    description: event.description,
                    address: event.address,
                    article_id: event.article_id,
                    start,
                    end
                };
            }));
        });
    });

    app.post('/cms/event/', (req, res) => {        
        eventSrv.create({
            description: req.body.description,
            address: req.body.address,
            article_id: req.body.article_id,
            start: new Date(req.body.start+''),
            end: new Date(req.body.end+'')
        }).then(event => {
            return res.json(event);
        });
    });

    app.put('/cms/event/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        eventSrv.update({
            id,
            description: req.body.name,
            address: req.body.address,
            article_id: req.body.article_id,
            start: new Date(req.body.start+''),
            end: new Date(req.body.end+'')
        }).then(event => {
            return res.json(event);
        });
    });

    app.delete('/cms/event/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        if (isNaN(id)) {
            return res.status(400);
        }
        eventSrv.destroy(id).then(() => {
            return res.json({ok: true});
        });
    });
}