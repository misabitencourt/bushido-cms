const createTableUsers = require('./create-table-users');
const createUsersToken = require('./create-users-token');

module.exports = [
    {id: 1, exec: createTableUsers},
    {id: 2, exec: createUsersToken}
];