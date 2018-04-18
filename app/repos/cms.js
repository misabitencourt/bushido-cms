const db = require('./db').cms;

module.exports.create = ({modelName, newRegister}) => db(modelName).insert(newRegister);

module.exports.list = ({modelName}) => {
    let query = db(modelName);
    
    return query.orderBy('id', 'desc').limit(15);
}

module.exports.retrieve = ({modelName, filters, params, select, from}) => {
    let whereSql = filters || '';

    let query = db(modelName);
    if (select) {
        query = query.select(select);
    }
    if (from) {
        query = query.from(from)
    }

    if (whereSql) {
        whereSql = `1=1 AND (${whereSql})`;
    }

    return query.whereRaw(whereSql, params || []);
};

module.exports.update = ({modelName, id, values}) => db(modelName).where('id', '=', id).update(values);

module.exports.destroy = ({modelName, id}) => db(modelName).where('id', '=', id).del();

