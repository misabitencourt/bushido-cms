const loginTest = require('./login');
const userCrud = require('./user');
const menuCrud = require('./menu');
const articleCrud = require('./article');

module.exports = [
    loginTest,
    userCrud,
    menuCrud,
    articleCrud
];