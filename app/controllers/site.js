const coverSrv = require('../services/covers');
const view = require('../views');

module.exports = app => {
    app.get('/', (req, res) => view({
        res,
        path: 'site',
        view: 'home',
        data: {
            title: 'Welcome!!',
            messages: [
                {msg: 'Be welcome here!'},
                {msg: 'Check out our products!!'}
            ]
        }
    }));
}