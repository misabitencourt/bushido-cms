const view = require('../views');

function lpad(val) {
    return (''+val).length === 1 ? ('0' + val) : val;
}

function dateFormat(date) {
    date = new Date(date +'');
    return `${lpad(date.getDate())}/${lpad(date.getMonth()+1)}/${date.getFullYear()}`;
}

module.exports = app => {
    app.get('/', async (req, res) => {
        const macros = await macroService.getAll();

        view({
            res,
            path: 'site',
            view: 'home',
            data: {
            }
        });
    });
}