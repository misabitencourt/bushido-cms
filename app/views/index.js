const handlebars = require('handlebars');
const dir = './app/views/';
const template = require('../repos/template');

module.exports = ({path, view, data, res}) => {
    data = data || {};

    (async () => {
        try {
            const header = await template(dir, path, 'header');
            const footer = await template(dir, path, 'footer');
            const yieldContent = await template(dir, path, view);
            const content = header + yieldContent + footer;
            const templateMount = handlebars.compile(content);
            const finalContent = templateMount(data);
            
            res.type('text/html');
            return res.send(finalContent);
        } catch (e) {
            console.error('Erro ao carregar arquivos de template', e);
            return res.sendStatus(500);
        }
    })();
}
