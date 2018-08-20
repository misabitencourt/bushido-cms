const cmsDb = require('../repos/db').cms;

module.exports = () => cmsDb.schema.createTable('news', table => {
    table.increments();
    table.string('title');
    table.string('description');
    table.string('author');
    table.integer('menu');
    table.text('abstract');
    table.text('text', 'longtext');
    table.text('cover', 'longtext');
    table.dateTime('published_at');
    table.index(['title', 'description', 'menu']);
    table.timestamps();
})
