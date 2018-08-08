const db = require('./db').cms;

module.exports.create = ({modelName, newRegister}) => db(modelName).insert(newRegister);

module.exports.list = ({select, modelName, leftJoins, limit=15}) => {
    let query = db(modelName);
    
    if (select) {
        query = query.select(select);
    }

    if (leftJoins) {
        leftJoins.forEach(lj => {
            query = query.leftJoin(lj.table, lj.localField, lj.foreignField);
        });
    }
    
    return query.orderBy(`${modelName}.id`, 'desc').limit(limit);
}

module.exports.retrieve = ({modelName, filters, params, select, from, leftJoins, limit=100}) => {
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

    return query.whereRaw(whereSql, params || []).limit(limit);
};

module.exports.update = ({modelName, id, values}) => db(modelName).where('id', '=', id).update(values);

module.exports.destroy = ({modelName, id}) => db(modelName).where('id', '=', id).del();

