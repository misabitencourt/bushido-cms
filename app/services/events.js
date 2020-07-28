const cms = require('../repos/cms');
const dateToYMD = require('../formatters/string').dateToYMD;

module.exports.create = event => cms.create({
    modelName: 'events',
    newRegister: {
        description: event.description,
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
    return cms.retrieve({
        select: ['events.*', 'articles.title as article_title'],
        modelName: 'events',
        filters: 'start > :start AND start < :end',
        leftJoins: [{table: 'articles', foreignField: 'articles.id', localField: 'events.article_id'}],
        params: {start: start.getTime(), end: end.getTime()}
    });
};

module.exports.findById = id => {
    return cms.retrieve({
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
