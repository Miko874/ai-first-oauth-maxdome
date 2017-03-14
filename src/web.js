require('dotenv').config({ silent: true });

const { app } = require('dexpress');

const maxdome = require('drequest-maxdome').getRequestBuilder();
const redis = require('dredis')(process.env.REDIS_URL);

require('dcontrollers')(app, [
  require('./controllers/linkedAccount')({ maxdome, redis }),
  require('./controllers/signin')({ maxdome, redis }),
]);
