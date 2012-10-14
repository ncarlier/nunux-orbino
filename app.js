#!/usr/bin/env node

var config = require('./config');
var express = require('express');

var app = module.exports = express();

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/client');
app.set('views engine', 'html');

app.enable('verbose errors');

if ('production' == app.settings.env) {
	app.disable('verbose errors');
}

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname + '/client'));
app.use(function(req, res, next) {
	res.status(404);
	if (req.accepts('html')) {
		res.render('404.html');
	} else if (req.accepts('json')) {
		res.send({error: 'Not found'});
	} else {
		res.type('txt').send('Not found');
	}
});
app.use(function(err, req, res, next) {
	console.log('ERR: ' + err);
	res.status(err.status || 500);
	if (req.accepts('html')) {
		res.render('500.html', {error: err});
	} else if (req.accepts('json')) {
		res.send({error: err});
	} else {
		res.type('txt').send(err);
	}
});

// Register routes...
require('./server/routes/index')(app);
require('./server/routes/color')(app);
require('./server/routes/monitor')(app);

if (!module.parent) {
	app.listen(config.server.port);
	console.log('App running in ' + app.settings.env + ' mode on port ' + config.server.port);
}
