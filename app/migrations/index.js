const fs = require('fs');
const migrations = require('./migrations');
const cmsDb = require('../repos/cms');
const config = require('dotenv').config().parsed;
const resources = require('../services/users').resourcesAvaliable;
const sha1 = require('sha1');

module.exports = () => {
    const migrated = `${fs.readFileSync('./migrated.dat')}`;
    const migratedIds = migrated.split(';');
    const success = [];
    let toMigrate;

    if (global.TESTING) {
        toMigrate = migrations;
    } else {
        toMigrate = migrations.filter(migration => migratedIds.indexOf(`${migration.id}`) === -1);
    }

    Promise.all(toMigrate.map(migration => {
        return new Promise(resolve => {
            migration.exec().then(() => {
                console.log(`Migration #${migration.id} SUCCESS!!!`);
                success.push(migration.id);
                resolve();
            }).catch(e => {
                console.error(e);
                console.log(`Migration #${migration.id} FAIL!!!`);
                resolve();
            });
        });
    })).then(() => {
        if (! global.TESTING) {
            fs.writeFileSync('./migrated.dat', migratedIds.concat(success).join(';'));
        }
        console.log('All migration finished');
        cmsDb.retrieve({
            modelName: 'users', 
            filters: 'email = :email',
            params: {email: config.ADMIN_EMAIL}
        }).then(users => {
            if (! users.length) {
                console.log('Admin user does not exists. Creating it...');
                let password = sha1(`${config.SECRET_WORD}${config.SECRET_WORD}`);
                return cmsDb.create({modelName: 'users', newRegister: {
                    name: 'admin',
                    email: config.ADMIN_EMAIL,
                    password,
                    phone: '9999999999',
                    acl: resources.join(';')
                }}).then(() => {
                    console.log('Admin user created!');
                }).catch(err => console.error(err));
            }
        }).catch(err => console.error(err));
    });
}