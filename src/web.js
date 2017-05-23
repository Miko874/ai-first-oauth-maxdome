require('dotenv-safe').config();

const express = require('express');
const app = express();
app.disable('x-powered-by');

const bodyParser = require('body-parser');

require('@dnode/middlewares')(app, [
  express.static(require('path').join(__dirname, '../www')),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
]);

const maxdome = require('@dnode/request-maxdome').getRequestBuilder();
const redis = require('@dnode/redis')(process.env.REDIS_URL);

require('@dnode/controllers')(app, [
  require('./controllers/linkedAccount')({ maxdome, redis }),
  require('./controllers/signin')({ maxdome, redis }),
]);

if (module.parent) {
  module.exports = app;
} else {
  app.listen(process.env.PORT);
}
