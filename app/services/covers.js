const cms = require('../repos/cms');

module.exports.findById = id => {
    return cms.retrieve({
        modelName: 'covers',
        filters: 'id = :id',
        params: {id}
    }).then(covers => covers.pop());
}

module.exports.create = cover => cms.create({
    modelName: 'covers',
    newRegister: cover
});

module.exports.retrieve = search => {
    let list;

    if ((search || '').trim()) {
        list = cms.retrieve({
            modelName: 'covers',
            filters: 'name LIKE :search OR description LIKE :search',
            params: {search: `%${search || ''}%`}
        })
    } else {
        list = cms.list({modelName: 'covers'});
    }
    
    return list.then(covers => covers.map(cover => ({
        id: cover.id,
        name: cover.name,
        description: cover.description,
        group: cover.group
    })));
};

module.exports.update = cover => cms.update({
    modelName: 'covers',
    id: cover.id,
    values: cover
});

module.exports.destroy = id => cms.destroy({
    modelName: 'covers',
    id
});

