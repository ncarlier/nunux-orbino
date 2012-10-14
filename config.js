/** Basic configuration */
module.exports = {
	/** Server options */
	server: {
		/** Server port */
		port: process.env.PORT || 8081
	},
	
	/** MQTT options */
	mqtt: {
		hostname: 'localhost',
		port: 1883,
        clientID: 'orbino-mobile-app'
	}
};
