const cms = require('../repos/cms');

module.exports.create = article => cms.create({
    modelName: 'articles',
    newRegister: article
});

module.exports.retrieve = search => {
    const leftJoins = [
        {table: 'menus', localField: 'articles.id', foreignField: 'menus.id'}
    ];

    const select = ['articles.id', 
                    'articles.title', 
                    'articles.description', 
                    'articles.text', 
                    'articles.menu', 
                    'menus.name as menuName'];

    if (search.trim()) {
        return cms.retrieve({
            select,
            modelName: 'articles',
            filters: 'title LIKE :search OR description LIKE :search',
            params: {search: `%${search || ''}%`},
            leftJoins
        })
    }

    return cms.list({
        select,
        modelName: 'articles', 
        leftJoins
    })
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

