const cmsDb = require('../repos/db').cms;

module.exports = () => cmsDb.schema.createTable('team_members', table => {
    table.increments();
    table.string('name');
    table.string('role');
    table.string('description');
    table.string('social_media');
    table.text('avatar', 'longtext');
    table.index(['id', 'name']);
    table.timestamps();
})
