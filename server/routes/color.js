var mqtt = require('../lib/mqtt');
var config = require('../../config');

var client = new mqtt.MQTTClient(config.mqtt.port, config.mqtt.hostname, config.mqtt.clientID);

module.exports = function(app){
	/**
	 * Color action.
	 */
	app.post('/', function(req, res, next){
		var color = req.body.color;
		if (color == undefined) {
			return next(new Error('Bad request'));
		}
		if (color.charAt(0) == '#') {
			color = color.substring(1);
		}
		if (!color.match(/^([A-Fa-f0-9]{6})$/)) {
			return next(new Error('Bad request'));
		}
		console.log('Send color ' + color + ' to orb ' + config.mqtt.clientID);
		client.publish('arduino/orb', color);

		if (req.accepts('html')) {
			res.render('index.html', {locals:{color:color}});
		} else if (req.accepts('json')) {
			res.send({status:'ok', color: color});
		} else {
			res.type('txt').send('ok\ncolor: ' + color);
		}
	});
};
