var mqtt   = require('mqtt'),
    logger = require('./logger');


/**
 * Get MQTT URI.
 * @return {String} MQTT string URI
 */
var getMQTTUri = function() {
  var uri = 'mqtt://localhost:1883';
  if (process.env.APP_MQTT_URI) {
    uri = process.env.APP_MQTT_URI;
  } else if (process.env.MQTT_PORT) { // Docker
    uri = process.env.MQTT_PORT.replace(/^tcp/, 'mqtt');
  }
  return uri;
};

/**
 * Connect to MQTT.
 * @param {String} str MQTT string URI
 */
var connect = function(str) {
  var match = /^mqtt:\/\/([a-z0-9\.]+):(\d+)$/.exec(str);
  if (!match) {
    throw new Error('Invalid MQTT uri: ' + str);
  }
  var host = match[1],
      port = parseInt(match[2]);

  logger.debug('Connecting to MQTT: %s ...', str);
  return mqtt.createClient(port, host);
};

/**
 * MQTT helper.
 * @module mqtt
 */
module.exports = connect(getMQTTUri());

