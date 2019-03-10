const cmsDb = require('../repos/db').cms;

module.exports = () => cmsDb.schema.table('products', function (table) {    
  table.string('group');
});