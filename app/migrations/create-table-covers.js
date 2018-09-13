const cmsDb = require('../repos/db').cms;

module.exports = () => cmsDb.schema.createTable('covers', table => {
    table.increments();
    table.string('name');
    table.string('description');
    table.string('group');
    table.text('cover', 'longtext');
    table.index(['name', 'description']);
    table.timestamps();
})
