const createTableUsers = require('./create-table-users');
const createUsersToken = require('./create-users-token');
const createTableMenus = require('./create-table-menus');
const createTableArticle = require('./create-table-article');
const createProducts = require('./create-table-product');
const createProductPhoto = require('./create-table-product-photo');
const addPriceToProduct = require('./add-price-to-product');

module.exports = [
    {id: 1, exec: createTableUsers},
    {id: 2, exec: createUsersToken},
    {id: 3, exec: createTableMenus},
    {id: 4, exec: createTableArticle},
    {id: 5, exec: createProducts},
    {id: 6, exec: createProductPhoto},
    {id: 7, exec: addPriceToProduct}
];