const cms = require('../repos/cms');

module.exports.findById = id => {
    return cms.retrieve({
        modelName: 'documents',
        filters: 'id = :id',
        params: {id}
    }).then(documents => {
        const document = documents.pop() || {};
        return {...document, doc: document.data}
    });
}

module.exports.create = doc => cms.create({
    modelName: 'documents',
    newRegister: doc
});

module.exports.retrieve = search => {
    let list;

    if ((search || '').trim()) {
        list = cms.retrieve({
            modelName: 'documents',
            filters: 'name LIKE :search OR description LIKE :search',
            params: {search: `%${search || ''}%`}
        })
    } else {
        list = cms.list({modelName: 'documents'});
    }
    
    return list.then(documents => documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        description: doc.description,
        category: doc.category
    })));
};

module.exports.update = doc => cms.update({
    modelName: 'documents',
    id: doc.id,
    values: {...doc, doc: undefined, data: doc.doc}
});

module.exports.destroy = id => cms.destroy({
    modelName: 'documents',
    id
});

