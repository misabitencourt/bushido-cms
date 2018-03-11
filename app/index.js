const express = require('express');
const glob = require('glob');
const path = require('path');
const root = path.normalize(__dirname);

module.exports = app => {
    app.use(express.static('public'));
    var controllers = glob.sync(root + '/controllers/*.js');
    controllers.forEach(controller => require(controller)(app));
}