const express = require('express');
const config = require('dotenv').config().parsed;
const appConfig = require('./app');

process.env.TZ = config.TZ;
const app = express();
appConfig(app);

app.listen(config.SERVER_PORT, () => {
    console.log(`App was booted on port ${config.SERVER_PORT}`);
});
  