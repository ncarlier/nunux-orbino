/** Basic configuration */
module.exports = {
	/** Server options */
	server: {
		/** Server port */
		port: process.env.PORT || 8081
	},
	
	/** MQTT options */
	mqtt: {
		hostname: 'test.mosquitto.org',
		port: 1883,
        clientID: 'orbino-mobile-app'
	}
};
