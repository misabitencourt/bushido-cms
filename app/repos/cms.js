const db = require('./db').cms;

module.exports.create = ({modelName, newRegister}) => db(modelName).insert(newRegister);

module.exports.retrieve = ({modelName, filters, params, select, from}) => {
    let whereSql = '';
    for (let i in filters) {
        let val = filters[i];
        whereSql += ` AND ${i} = :${i}`;
    }

    let query = db(modelName);
    if (select) {
        query = query.select(select);
    }
    if (from) {
        query = query.from(from)
    }
    
    return query.whereRaw('1=1' + whereSql, params || []);
};

module.exports.update = ({modelName, id, values}) => db(modelName).where('id', '=', id).update(values);

module.exports.destroy = ({modelName, id}) => db(modelName).where('id', '=', id).del();

