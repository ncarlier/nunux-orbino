module.exports = function(app){
	/**
	 * Monitoring page.
	 */
	app.get('/monitor', function(req, res) {
		res.format({
			html: function(){
				res.send('<html><body>ok</body></html>');
			},
			text: function(){
				res.type('txt').send('ok');
			},
			json: function(){
				res.send({status:'ok'});
			}
		})
	});
};
