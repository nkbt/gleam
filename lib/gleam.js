'use strict';

var _ = require('underscore');
var _s = require('underscore.string');
var factory = require('./factory');

/**
 * @param {String} root
 */
exports.setRoot = function (root) {
	factory.setRoot(root);
};

exports.is = function (entity, namespace) {
	return !_.isEmpty(entity) &&
		_.isObject(entity) &&
		_.isFunction(entity.is) &&
		entity.is(namespace);
};
exports.entity = factory.get;
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