const express = require('express');
const glob = require('glob');
const path = require('path');
const migrations = require('./migrations');
const root = path.normalize(__dirname);
const bodyParser = require('body-parser');
const authMiddleware = require('./middleware/auth');

module.exports = app => {
    migrations();
    app.use(express.static('public'));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(authMiddleware);
    var controllers = glob.sync(root + '/controllers/*.js');
    controllers.forEach(controller => require(controller)(app));
}