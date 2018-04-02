const cms = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './cms.db'
    }
});


module.exports = {cms}