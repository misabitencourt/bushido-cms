const cms = require('knex')({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: global.TESTING ? './cms.test.db' : './cms.db'
    }
});


module.exports = {cms}