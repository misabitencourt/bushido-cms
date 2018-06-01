const cmsDb = require('../repos/db').cms;

module.exports = () => cmsDb.schema.createTable('menus', table => {
    table.increments();
    table.string('name');
    table.string('description');
    table.string('order');
    table.index(['name', 'description']);
    table.timestamps();
})
