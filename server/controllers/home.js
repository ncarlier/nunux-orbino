/**
 * Home page (aka index).
 */
module.exports = function(req, res) {
  res.render('index', req.context);
};
