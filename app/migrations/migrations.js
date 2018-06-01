const createTableUsers = require('./create-table-users');
const createUsersToken = require('./create-users-token');
const createTableMenus = require('./create-table-menus');

module.exports = [
    {id: 1, exec: createTableUsers},
    {id: 2, exec: createUsersToken},
    {id: 3, exec: createTableMenus}
];