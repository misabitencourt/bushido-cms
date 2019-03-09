const cms = require('knex')({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: './cms.db'
    }
});


module.exports = {cms}