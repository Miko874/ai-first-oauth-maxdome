require('dotenv-safe').config();

const maxdome = require('drequest-maxdome').getRequestBuilder();
const redis = require('dredis')(process.env.REDIS_URL);

const app = require('dexpress')();
app.use(require('express').static('www'));
require('dcontrollers')(
  app,
  [
    require('./controllers/linkedAccount')({ maxdome, redis }),
    require('./controllers/signin')({ maxdome, redis }),
  ]
);
