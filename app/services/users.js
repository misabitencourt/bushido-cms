const cms = require('../repos/cms');
const sha1 = require('sha1');
const config = require('dotenv').config().parsed;


module.exports.checkToken = token => new Promise((resolve, reject) => {
    if (! token) {
        return resolve(null);
    }

    return cms.retrieve({
        modelName: 'users',
        filters: 'token=:token',
        limit: 1,
        params: {token}
    }).then(users => {        
        if (! (users && users.length)) {
            return resolve(null);
        }

        return resolve(users.pop());
    });
})


module.exports.login = login => new Promise((resolve, reject) => {
    if (! (login && login.email && login.passwd)) {
        return resolve(null);
    }

    let email = login.email;
    let password = sha1(`${login.passwd}${config.SECRET_WORD}`);

    return cms.retrieve({
        modelName: 'users',
        filters: 'email=:email AND password=:password',
        limit: 1,
        params: {email, password}
    }).then(users => {
        if (! (users && users.length)) {
            return resolve(null);
        }

        const user = users.pop();
        user.token = sha1(`${user.email}${config.SECRET_WORD}${new Date().getTime()}`);
        cms.update({
            modelName: 'users', 
            id: user.id, 
            values: user
        }).then(() => {
            resolve({
                name: user.name,
                email: user.email,
                token: user.token,
                acl: user.acl
            });
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

module.exports.update = user => {
    if (user.password) {
        user.password = sha1(`${user.password}${config.SECRET_WORD}`);
    }

    return cms.update({
        modelName: 'users',
        id: user.id,
        values: user
    });
}

module.exports.destroy = id => cms.destroy({
    modelName: 'users',
    id
});


