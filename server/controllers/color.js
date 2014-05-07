var mqtt   = require('../helpers').mqtt,
    logger = require('../helpers').logger,
    errors = require('../helpers').errors;

module.exports = {
  /**
   * Set color.
   */
  set: function(req, res, next) {
    var color = req.body.color;
    if (!color || !color.match(/^#([A-Fa-f0-9]{6})$/)) {
      return next(new errors.BadRequest('Bad color parameter.'));
    }

    mqtt.publish('arduino/orb', color.substring(1));

    var msg = 'Orbs notified.';
    logger.info(msg, color);

    res.format({
      html: function(){
        res.render('index', {locals:{color:color}});
      },
      text: function(){
        res.type('txt').send(msg + '\ncolor: ' + color);
      },
      json: function(){
        res.json({status: msg, color: color});
      }
    });
  }
};
