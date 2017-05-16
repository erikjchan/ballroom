
/**
 * Balroom API
 */

const bodyParser = require("body-parser")

/**
 * Takes an express app, sets up the API around it.
 */
module.exports = app => {
  app.use('/api', bodyParser.urlencoded({ extended: false }));
  app.use('/api', bodyParser.json());
  require('./routes')(app)
  return app
}