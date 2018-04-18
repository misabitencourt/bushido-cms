const express = require('express');
const glob = require('glob');
const path = require('path');
const migrations = require('./migrations');
const root = path.normalize(__dirname);
const bodyParser = require('body-parser');

module.exports = app => {
    migrations();
    app.use(express.static('public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    var controllers = glob.sync(root + '/controllers/*.js');
    controllers.forEach(controller => require(controller)(app));
}