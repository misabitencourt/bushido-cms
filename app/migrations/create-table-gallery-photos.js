const cmsDb = require('../repos/db').cms;

module.exports = () => cmsDb.schema.createTable('gallery_photos', table => {
    table.increments();
    table.string('description');
    table.integer('gallery_id');
    table.text('data', 'longtext');
    table.index(['description', 'gallery_id']);
    table.timestamps();
});
