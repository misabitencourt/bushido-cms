const cms = require('../repos/cms');
const sha1 = require('sha1');
const config = require('dotenv').config().parsed;


module.exports.checkToken = token => new Promise((resolve, reject) => {
    if (! token) {
        return resolve(null);
    }

    return cms.retrieve({
        modelName: 'users',
        filters: 'token=:token LIMIT 1',
        params: {token}
    }).then(users => {        
        if (! (users && users.length)) {
            return resolve(null);
        }

        return resolve(users.pop());
    });
})


module.exports.login = login => new Promise((resolve, reject) => {
    if (! (login && login.email && login.pass)) {
        return resolve(null);
    }

    let email = login.email;
    let password = sha1(`${user.password}${config.SECRET_WORD}`);    

    return cms.retrieve({
        modelName: 'users',
        filters: 'email=:email AND password=:password LIMIT 1',
        params: {email, password}
    }).then(users => {
        if (! (users && users.length)) {
            return resolve(null);
        }

        const user = users.pop();
        
        return resolve({
            name: user.name,
            email: user.email,
            token: user.token
        });
    });
})


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


