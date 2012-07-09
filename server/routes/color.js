var mqtt = require('../lib/mqtt');
var config = require('../../config');
var form = require("express-form"),
    filter = form.filter,
	validate = form.validate;

var client = new mqtt.MQTTClient(config.mqtt.port, config.mqtt.hostname, config.mqtt.clientID);

module.exports = function(app){
	/**
	 * Color action.
	 */
	app.post(
            '/',
            form(
                filter("color").trim(),
                validate("color").required().is(/^([A-Fa-f0-9]{6})$/)
            ),
            function(req, res, next){
        
        if (!req.form.isValid) {
            // Handle errors
			var errors = {
				title: 'Bad Request',
				color: req.form.getErrors("color")
			};
			return next(new Error(errors));
		}
        
        var color = req.form.color;
        client.publish('arduino/orb', color);
        
		if (req.accepts('html')) {
            res.render('app.html', {locals:{color:color}});
		} else if (req.accepts('json')) {
			res.send({status:'ok', color: color});
		} else {
			res.type('txt').send('ok\ncolor: ' + color);
		}
	});
};
