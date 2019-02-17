const cms = require('../repos/cms');
const dateToYMD = require('../formatters/string').dateToYMD;

module.exports.create = event => cms.create({
    modelName: 'events',
    newRegister: {
        description: event.name,
        address: event.address,
        article_id: event.article_id,
        start: event.start,
        end: event.end
    }
});

module.exports.retrieve = search => {
    if (search.trim()) {
        return cms.retrieve({
            modelName: 'events',
            filters: 'title LIKE :search OR description LIKE :search',
            leftJoins: [{table: 'articles', foreignField: 'id', localField: 'article_id'}],
            params: {search: `%${search || ''}%`}
        })
    }

    return cms.list({modelName: 'events'}).then(events => retrievePictures(events))
};

module.exports.findByDateRange = (start, end) => {
    const startIso = `${dateToYMD(start)}`;
    const endIso = `${dateToYMD(end)}`;
    
    return cms.retrieve({
        modelName: 'events',
        filters: 'start BETWEEN :start AND :end',
        leftJoins: [{table: 'articles', foreignField: 'id', localField: 'article_id'}],
        params: {start: `${startIso} 00:00:00`, end: `${endIso} 23:59:59`}
    });
};

module.exports.findById = id => {
    return cms.list({
        modelName: 'events',
        filters: 'id = :id',
        params: {id}
    }).then(events => {
        const event = events.pop()
        
        return event || null;
    });
}

module.exports.update = event => cms.update({
    modelName: 'events',
    id: event.id,
    values: event
});

module.exports.destroy = id => cms.destroy({
    modelName: 'events',
    id
});
