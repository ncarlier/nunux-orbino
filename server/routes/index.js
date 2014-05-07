var controller = require('../controllers'),
    middleware = require('../middlewares');

/**
 * Server routes.
 * @module routes
 */
module.exports = function(app) {
  var contextHandler = middleware.contextHandler(app);
  // Routes...
  app.get('/', contextHandler, controller.homepage);
  app.post('/color', contextHandler, controller.color.set);
};
