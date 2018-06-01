const cms = require('../repos/cms');

module.exports.create = menu => cms.create({
    modelName: 'menus',
    newRegister: menu
});

module.exports.retrieve = search => {
    if (search.trim()) {
        return cms.retrieve({
            modelName: 'menus',
            filters: 'name LIKE :search OR description LIKE :search',
            params: {search: `%${search || ''}%`}
        })
    }

    return cms.list({modelName: 'menus'})
};

module.exports.update = menu => cms.update({
    modelName: 'menus',
    id: menu.id,
    values: menu
});

module.exports.destroy = id => cms.destroy({
    modelName: 'menus',
    id
});


