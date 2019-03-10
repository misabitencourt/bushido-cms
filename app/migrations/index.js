const fs = require('fs');
const migrations = require('./migrations');
const cmsDb = require('../repos/cms');
const config = require('dotenv').config().parsed;
const resources = require('../services/users').resourcesAvaliable;

module.exports = () => {
    const migrated = `${fs.readFileSync('./migrated.dat')}`;
    const migratedIds = migrated.split(';');
    const toMigrate = migrations.filter(migration => migratedIds.indexOf(`${migration.id}`) === -1);
    const success = [];

    cmsDb.retrieve({
        modelName: 'users', 
        filters: 'email = :email',
        params: {email: config.ADMIN_EMAIL}
    }).then(users => {
        if (! users.length) {
            console.log('Admin user does not exists. Creating it...');
            return cmsDb.create({modelName: 'users', newRegister: {
                name: 'admin',
                email: config.ADMIN_EMAIL,
                password: config.SECRET_WORD,
                phone: '9999999999',
                acl: resources.join(';')
            }}).then(() => {
                console.log('Admin user created!');
            }).catch(err => console.error(err));
        }
    }).catch(err => console.error(err));

    Promise.all(toMigrate.map(migration => {
        return new Promise((resolve, reject) => {
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
        fs.writeFileSync('./migrated.dat', migratedIds.concat(success).join(';'));
        console.log('All migration finished');
    });
}