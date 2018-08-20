const cms = require('../repos/cms');

function retrieveMenus(news) {
    return Promise.all(news.map(neww => {
        return cms.retrieve({
            modelName: 'menus',
            filters: 'id = :id',
            params: {id: neww.menu}
        }).then(menus => {
            neww.menu = menus[0];
            return neww;
        });
    }));
}

module.exports.create = neww => cms.create({
    modelName: 'news',
    newRegister: neww
});

module.exports.retrieve = search => {
    let list;

    if (search.trim()) {
        list = cms.retrieve({
            modelName: 'news',
            filters: 'title LIKE :search OR description LIKE :search',
            params: {search: `%${search || ''}%`}
        })
    } else {
        list = cms.list({modelName: 'news'})
    }

    return list.then(news => retrieveMenus(news))    
};

module.exports.update = neww => cms.update({
    modelName: 'news',
    id: neww.id,
    values: neww
});

module.exports.destroy = id => cms.destroy({
    modelName: 'news',
    id
});

