const cmsDb = require('../repos/db').cms;

module.exports = () => cmsDb.schema.createTable('events', table => {
    table.increments();
    table.string('description');
    table.integer('article_id');
    table.string('address');
    table.datetime('start');
    table.datetime('end');
    table.index(['start', 'end']);
    table.timestamps();
})
