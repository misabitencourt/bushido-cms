const cms = require('../repos/cms');

module.exports.create = macro => cms.create({
    modelName: 'macros',
    newRegister: macro,
    limit: 999
});

module.exports.retrieve = search => {
    if (search.trim()) {
        return cms.retrieve({
            modelName: 'macros',
            filters: 'name LIKE :search OR description LIKE :search',
            params: {search: `%${search || ''}%`},
            limit: 999
        })
    }

    return cms.list({modelName: 'macros'})
};

module.exports.update = macro => cms.update({
    modelName: 'macros',
    id: macro.id,
    values: macro
});

module.exports.destroy = id => cms.destroy({
    modelName: 'macros',
    id
});


