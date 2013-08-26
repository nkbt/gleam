'use strict';

var _s = require('underscore.string');
var factory = require('./factory');

/**
 * @param {String} root
 */
exports.setRoot = function (root) {
	factory.setRoot(root);
};

exports.entity = factory.get;
exports.entityConstructor = factory.getConstructor;
exports.fromJson = require('./from-json');


/**
 * @param {ExpressServerRequest} req
 * @param {ExpressServerResponse} res
 * @param {Function} callback
 */
exports.serveEntity = function (req, res, callback) {

	var namespace = _s.trim(req.url, '/').replace(/\.js$/g, '');

	return factory.getClientJsModificationTime(namespace, function (error, result) {
		if (error !== null) {
			callback(error);
		} else {
			res.set('Last-Modified', result);
			if (req.fresh) {
				res.send(304);
			} else {
				factory.getClientJs(namespace, function (error, content) {
					if (error !== null) {
						callback(error);
					} else {
						res.set('Content-Type', 'text/javascript');
						res.set('Content-Length', content.length);
						res.send(content);
					}
				});
			}
		}
	});

};