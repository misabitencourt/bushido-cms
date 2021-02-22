const cmsDb = require('../repos/db').cms;

module.exports = () => cmsDb.schema.createTable('galleries', table => {
    table.increments();
    table.string('name');
    table.string('short_description');
    table.text('long_description');
    table.index(['name']);
    table.timestamps();
});
