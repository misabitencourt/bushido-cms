const cms = require('../repos/cms');
let macroCache = null;

module.exports.getAll = async () => {
    if (macroCache) {
        return macroCache;
    }
    const all = await cms.list({modelName: 'macros', limit: 999});
    const res = {};
    all.forEach(macro => res[macro.name] = macro.strval || macro.textval);

    return macroCache = res;
};

module.exports.create = macro => {
    macroCache = null;

    return cms.create({
        modelName: 'macros',
        newRegister: macro,
        limit: 999
    });
}

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

module.exports.update = macro => {
    macroCache = null;

    return cms.update({
        modelName: 'macros',
        id: macro.id,
        values: macro
    });
}

module.exports.destroy = id => {
    macroCache = null;

    return cms.destroy({
        modelName: 'macros',
        id
    });
}


