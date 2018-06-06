const cmsDb = require('../repos/db').cms;

module.exports = () => cmsDb.schema.createTable('articles', table => {
    table.increments();
    table.string('title');
    table.string('description');
    table.integer('menu');
    table.text('text', 'longtext');
    table.index(['title', 'description']);
    table.timestamps();
})
