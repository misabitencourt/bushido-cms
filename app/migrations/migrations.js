const createTableUsers = require('./create-table-users');
const createUsersToken = require('./create-users-token');
const createTableMenus = require('./create-table-menus');
const createTableArticle = require('./create-table-article');
const createProducts = require('./create-table-product');
const createProductPhoto = require('./create-table-product-photo');
const addPriceToProduct = require('./add-price-to-product');
const createTableMacros = require('./create-table-macros');
const addTypeToMacro = require('./add-type-to-macro');
const createTableNew = require('./create-table-new');
const createTableCovers = require('./create-table-covers');
const createTableEvents = require('./create-table-events');

module.exports = [
    {id: 1, exec: createTableUsers},
    {id: 2, exec: createUsersToken},
    {id: 3, exec: createTableMenus},
    {id: 4, exec: createTableArticle},
    {id: 5, exec: createProducts},
    {id: 6, exec: createProductPhoto},
    {id: 7, exec: addPriceToProduct},
    {id: 8, exec: createTableMacros},
    {id: 9, exec: addTypeToMacro},
    {id: 10, exec: createTableNew},
    {id: 11, exec: createTableCovers},
    {id: 12, exec: createTableEvents}
];