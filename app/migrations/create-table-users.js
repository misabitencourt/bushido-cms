const cmsDb = require('../repos/db').cms;

module.exports = () => cmsDb.schema.createTable('users', table => {
    table.increments();
    table.string('name');
    table.string('email');
    table.string('phone');
    table.string('password');
    table.string('acl');
    table.index(['id', 'email', 'password']);
    table.timestamps();
})
