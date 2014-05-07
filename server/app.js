#!/usr/bin/env node
/**

  NUNUX Orbino

  Copyright (c) 2014 Nicolas CARLIER (https://github.com/ncarlier)

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var express        = require('express'),
    morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    compress       = require('compression'),
    methodOverride = require('method-override'),
    cookieParser   = require('cookie-parser'),
    session        = require('express-session'),
    path           = require('path'),
    logger         = require('./helpers').logger,
    middleware     = require('./middlewares'),
    appInfo        = require('../package.json');

var app = module.exports = express();

var env = process.env.NODE_ENV || 'development';

app.set('info', {
  name: appInfo.name,
  title: appInfo.name,
  description: appInfo.description,
  version: appInfo.version,
  author: appInfo.author
});
app.set('port', process.env.APP_PORT || 3000);
app.set('realm', process.env.APP_REALM || 'http://localhost:' + app.get('port'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// Logger
app.use(morgan('dev'));
app.use(compress());
app.use(cookieParser(process.env.APP_SESSION_SECRET || 'NuNUX0rbiN0_'));
app.use(bodyParser());
app.use(session());
app.use(methodOverride());

if ('development' == env) {
  app.use(require('less-middleware')(path.join(__dirname, '../client')));
  app.use(express.static(path.join(__dirname, '../client')));
}
if ('production' == env) {
  var oneDay = 86400000;
  app.use(express.static(path.join(__dirname, '../dist'), {maxAge: oneDay}));
}

// Register routes...
require('./routes')(app);

app.use(middleware.errorHandler(app));

if (!module.parent) {
  app.listen(app.get('port'), function() {
    logger.info('%s web server listening on port %s (%s mode)',
                app.get('info').name,
                app.get('port'),
                app.get('env'));
  });
}

