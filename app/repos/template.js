const cached = {};
const fs = require('fs');

module.exports = (dir, path, file) => new Promise((resolve, reject) => {
    let cachedFile = cached[`${dir}-${file}-${path}`];
    if (cachedFile) {
        return cachedFile;
    }

    fs.readFile(`${dir}/${path}/${file}.html`, 'utf-8', (errH, html) => {
        if (errH) {
            return reject(errH);
        }
        cached[`${dir}-${file}-${path}`] = html;
        return resolve(html);
    });
});