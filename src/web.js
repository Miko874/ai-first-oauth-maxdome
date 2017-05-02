require('dotenv-safe').config();

const maxdome = require('drequest-maxdome').getRequestBuilder();
const redis = require('dredis')(process.env.REDIS_URL);

require('dcontrollers')(
  require('dexpress')(),
  [
    require('./controllers/linkedAccount')({ maxdome, redis }),
    require('./controllers/signin')({ maxdome, redis }),
  ]
);
