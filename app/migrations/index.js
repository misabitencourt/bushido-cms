const fs = require('fs');
const migrations = require('./migrations');


module.exports = () => {
    const migrated = `${fs.readFileSync('./migrated.dat')}`;
    const migratedIds = migrated.split(';');
    const toMigrate = migrations.filter(migration => migratedIds.indexOf(`${migration.id}`) === -1);
    const success = [];

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