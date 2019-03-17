const loginTest = require('./login');
const userCrud = require('./user');
const menuCrud = require('./menu');
const articleCrud = require('./article');
const coverCrud = require('./cover');
const productCrud = require('./product');

module.exports = [
    loginTest,
    userCrud,
    menuCrud,
    articleCrud,
    coverCrud,
    productCrud
];