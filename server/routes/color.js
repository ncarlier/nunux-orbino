var mqtt = require('../lib/mqtt');
var config = require('../../config');
var form = require("express-form"),
    filter = form.filter,
	validate = form.validate;

var client = new mqtt.MQTTClient(config.mqtt.port, config.mqtt.hostname, config.mqtt.clientID);

function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}
function toHex(n) {
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
}

module.exports = function(app){
	/**
	 * Color action.
	 */
	app.post(
            '/',
            form(
                filter("red").trim(),
                validate("red").required().isInt(),
                filter("green").trim(),
                validate("green").required().isInt(),
                filter("blue").trim(),
                validate("blue").required().isInt()
            ),
            function(req, res, next){
        
        if (!req.form.isValid) {
            // Handle errors
			var errors = {
				title: 'Bad Request',
				red: req.form.getErrors("red"),
				green: req.form.getErrors("green"),
                blue: req.form.getErrors("blue")
			};
			return next(new Error(errors));
		}
        
        var red = req.form.red;
        var green = req.form.green;
        var blue = req.form.blue;
        var color = rgbToHex(red, green, blue);
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
