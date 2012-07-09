/** Basic configuration */
module.exports = {
	/** Server options */
	server: {
		/** Server port */
		//port: process.env.PORT || 8081
        port: 8081
	},
	
	/** MQTT options */
	mqtt: {
		hostname: 'localhost',
		port: 1883,
        clientID: 'orbino-mobile-app'
	},
	
	/** Syslog options */
	syslog: {
		tag: 'orbino'
	},
	
	/** Secret use to crypt sessions */
	secret: process.env.APP_SECRET || 'orbinoS3cr3T!'
};