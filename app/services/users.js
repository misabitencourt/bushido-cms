const cms = require('../repos/cms');
const sha1 = require('sha1');
const config = require('dotenv').config().parsed;

module.exports.create = user => {
    if (user.password) {
        user.password = sha1(`${user.password}${config.SECRET_WORD}`);
    }
    
    return cms.create({
        modelName: 'users',
        newRegister: user
    });
};

module.exports.retrieve = search => {
    if (search.trim()) {
        return cms.retrieve({
            modelName: 'users',
            filters: 'name LIKE :search OR email LIKE :search',
            params: {search: `%${search || ''}%`}
        })
    }

    return cms.list({modelName: 'users'})
};

module.exports.update = user => cms.update({
    modelName: 'users',
    id: user.id,
    values: user
});

module.exports.destroy = id => cms.destroy({
    modelName: 'users',
    id
});


