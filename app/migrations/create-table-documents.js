const cmsDb = require('../repos/db').cms;

module.exports = () => cmsDb.schema.createTable('documents', table => {
    table.increments();
    table.string('name');
    table.string('category');
    table.string('description');
    table.text('long_description');
    table.text('data', 'longtext');
    table.index(['name', 'category']);
    table.timestamps();
});
