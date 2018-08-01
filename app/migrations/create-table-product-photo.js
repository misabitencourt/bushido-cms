const cmsDb = require('../repos/db').cms;

module.exports = () => cmsDb.schema.createTable('product_photos', table => {
    table.increments();
    table.string('description');
    table.integer('product_id');
    table.text('data', 'longtext');
    table.index(['description', 'product_id']);
    table.timestamps();
});
