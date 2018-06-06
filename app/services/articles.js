const cms = require('../repos/cms');

module.exports.create = article => cms.create({
    modelName: 'articles',
    newRegister: article
});

module.exports.retrieve = search => {
    if (search.trim()) {
        return cms.retrieve({
            modelName: 'articles',
            filters: 'title LIKE :search OR description LIKE :search',
            params: {search: `%${search || ''}%`}
        })
    }

    return cms.list({modelName: 'articles'})
};

module.exports.update = article => cms.update({
    modelName: 'articles',
    id: article.id,
    values: article
});

module.exports.destroy = id => cms.destroy({
    modelName: 'articles',
    id
});

