var mqtt = require('../lib/mqtt');
var config = require('../../config');

// Maybe switch with https://github.com/adamvr/MQTT.js
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
		client.publish('arduino/orb', color);

		var msg = 'Orb ' + config.mqtt.clientID + ' notified.';

		res.format({
			html: function(){
				res.render('index.html', {locals:{color:color}});
			},
			text: function(){
				res.type('txt').send(msg + '\ncolor: ' + color);
			},
			json: function(){
				res.json({status: msg, color: color});
			}
		})
	});
};
