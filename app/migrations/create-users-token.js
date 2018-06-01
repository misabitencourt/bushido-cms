const cmsDb = require('../repos/db').cms;

module.exports = () => cmsDb.schema.alterTable('users', function(t) {
    t.string('token');
})