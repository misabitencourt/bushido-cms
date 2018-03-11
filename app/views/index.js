const handlebars = require('handlebars');
const root = path.normalize(__dirname);
const fs = require('fs');
const i18nText = require('../i18n/text');

module.exports = ({path, view, data, res}) => {
    data = data || {};
    data.i18n = i18nText;

    fs.readFile(`${root}/${path}/header.html`, 'utf-8', (errH, header) => {
        fs.readFile(`${root}/${path}/footer.html`, 'utf-8', (errF, footer) => {
            fs.readFile(`${root}/${path}/${view}.html`, 'utf-8', (errSrc, src) => {
                if (errH || errF || errSrc) {
                    console.error([errH, errF, errSrc]);
                    return res.sendStatus(500);
                }

                let template = handlebars.compile(src);
                template = template(data);
                res.type('text/html');

                return res.send(template);
            });
        });
    });
}
