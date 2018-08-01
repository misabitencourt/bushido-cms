const cms = require('../repos/cms');

function retrieveMenus(articles) {
    return Promise.all(articles.map(article => {
        return cms.retrieve({
            modelName: 'menus',
            filters: 'id = :id',
            params: {id: article.menu}
        }).then(menus => {
            article.menu = menus[0];
            return article;
        });
    }));
}

module.exports.create = article => cms.create({
    modelName: 'articles',
    newRegister: article
});

module.exports.retrieve = search => {
    let list;

    if (search.trim()) {
        list = cms.retrieve({
            modelName: 'articles',
            filters: 'title LIKE :search OR description LIKE :search',
            params: {search: `%${search || ''}%`}
        })
    } else {
        list = cms.list({modelName: 'articles'})
    }

    return list.then(articles => retrieveMenus(articles))    
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

