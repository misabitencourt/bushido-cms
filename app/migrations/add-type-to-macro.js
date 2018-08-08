const cmsDb = require('../repos/db').cms;

module.exports = () => cmsDb.schema.table('macros', function (table) {    
  table.string('type');
})