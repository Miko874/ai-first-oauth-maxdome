require('dotenv-safe').config();

const maxdome = require('drequest-maxdome').getRequestBuilder();
const redis = require('dredis')(process.env.REDIS_URL);

const app = require('dexpress')();
app.use(require('express').static('www'));
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require('dcontrollers')(app, [
  require('./controllers/linkedAccount')({ maxdome, redis }),
  require('./controllers/signin')({ maxdome, redis }),
]);
