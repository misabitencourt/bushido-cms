const tests = require('./api-tests');
global.TESTING = true;
const express = require('express');
const config = require('dotenv').config().parsed;
const appConfig = require('../app');
process.env.TZ = config.TZ;
const app = express();
appConfig(app);

for (let test of tests) {
    test(app);
}
