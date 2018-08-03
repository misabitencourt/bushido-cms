const cmsDb = require('../repos/db').cms;

module.exports = () => cmsDb.schema.createTable('macros', table => {
    table.increments();
    table.string('name');
    table.string('description');
    table.string('strval');
    table.text('textval', 'longtext');

    table.index(['name', 'description', 'strval', 'textval']);
    table.timestamps();
});
