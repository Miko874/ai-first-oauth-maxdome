require('dotenv-safe').config();

const maxdome = require('drequest-maxdome').getRequestBuilder();
const redis = require('dredis')(process.env.REDIS_URL);

const app = require('dexpress')();
const bodyParser = require('body-parser');
require('dmiddlewares')(app, [
  require('express').static('www'),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
]);
require('dcontrollers')(app, [
  require('./controllers/linkedAccount')({ maxdome, redis }),
  require('./controllers/signin')({ maxdome, redis }),
]);
