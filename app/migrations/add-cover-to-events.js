const cmsDb = require('../repos/db').cms;

module.exports = () => cmsDb.schema.alterTable('events', table => {
    table.text('cover', 'longtext');
})
