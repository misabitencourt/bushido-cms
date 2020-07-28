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

module.exports.getIds = async () => cms.retrieve({
    select: 'id',
    modelName: 'news',
    limit: 99999
});

module.exports.getOffset = async page => cms.list({
    modelName: 'news',
    limit: '4',
    offset: page * 4
});

module.exports.findByIdNoMenu = async id => {
    const list = await cms.retrieve({
        modelName: 'news',
        filters: 'id = :id',
        params: {id},
        limit: 9999
    });
    return list.pop();
}

module.exports.findById = id => {
    return cms.retrieve({
        modelName: 'news',
        filters: 'id = :id',
        params: {id}
    }).then(news => {
        const neww = news.pop()
        if (! neww) {
            return null;
        }

        return cms.retrieve({
            modelName: 'menus',
            filters: 'id = :menu',
            params: {menu: neww.menu}
        }).then(menus => {
            neww.menu = menus.pop();
            return neww;
        });
    });
}

module.exports.create = neww => cms.create({
    modelName: 'news',
    newRegister: neww
});

module.exports.retrieve = search => {
    let list;

    if ((search || '').trim()) {
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

