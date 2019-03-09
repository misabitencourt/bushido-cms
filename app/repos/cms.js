const db = require('./db').cms;
const kv = require('./kv');

function createQueryId(params=[]) {
    return params.join('^');
}

function cacheClear() {
    kv.clean();
}

db.on('query', queryData => console.log(queryData));
 
module.exports.list = ({select, modelName, leftJoins, limit=15, ignoreCache=false}) => {
    const queryId = createQueryId([
        'list',
        select,
        modelName,
        `${(leftJoins || []).map(lj => `${lj.table}-${lj.localField}-${lj.foreignField}`).join('-')}`,
        limit
    ]);

    if (! ignoreCache) {
        const cached = kv.get(queryId);
        if (cached) {
            return new Promise(resolve => resolve(cached));
        }
    }
    
    let query = db(modelName);
    
    if (select) {
        query = query.select(select);
    }

    if (leftJoins) {
        leftJoins.forEach(lj => {
            query = query.leftJoin(lj.table, lj.localField, lj.foreignField);
        });
    }

    console.log(query.toSQL().toNative());
    
    return query.orderBy(`${modelName}.id`, 'desc').limit(limit).then(rows => {
        kv.put(queryId, rows);
        return rows;
    });
}

module.exports.retrieve = ({modelName, filters, params, select, from, leftJoins, limit=100, ignoreCache=false}) => {
    let whereSql = filters || '';

    let query = db(modelName);
    if (select) {
        query = query.select(select);
    }
    if (from) {
        query = query.from(from);
    }
    if (leftJoins) {
        leftJoins.forEach(lj => {
            query = query.leftJoin(lj.table, lj.localField, lj.foreignField);
        });
    }

    if (whereSql) {
        whereSql = `1=1 AND (${whereSql})`;
    }

    const queryId = createQueryId([
        'retrieve',
        modelName,
        whereSql,
        `${(leftJoins || []).map(lj => `${lj.table}-${lj.localField}-${lj.foreignField}`).join('-')}`,
        limit
    ]);

    if (! ignoreCache) {
        const cached = kv.get(queryId);
        if (cached) {
            return new Promise(resolve => resolve(cached));
        }
    }

    return query.whereRaw(whereSql, params || []).limit(limit).then(rows => {
        kv.put(queryId, rows);
        return rows;
    });
};

module.exports.update = ({modelName, id, values}) => {
    cacheClear();
    return db(modelName).where('id', '=', id).update(values);
};

module.exports.destroy = ({modelName, id}) => {
    cacheClear();
    return db(modelName).where('id', '=', id).del();
};

module.exports.create = ({modelName, newRegister}) => {
    cacheClear();
    return db(modelName).insert(newRegister);
};

