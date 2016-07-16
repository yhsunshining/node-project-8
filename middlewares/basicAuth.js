var auth = require('basic-auth');
var authList = require('../config/authConfig');

module.exports = function(req, res, next) {
	var credentials = auth(req);

	if (!credentials || !authList[credentials.name] || credentials.pass != authList[credentials.name]) {
	    res.statusCode = 401;
	    res.setHeader('WWW-Authenticate', 'Basic realm="example"');
	    res.end('Access denied');
	} else {
	    next();
	}
}