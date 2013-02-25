'use strict';

var _ = require('underscore');
var _s = require('underscore.string');
var modelFactory = require('./model-factory');
var entityFactory = require('./entity-factory');

/**
 * @param {String} modelRoot
 */
exports.setModelRoot = function (modelRoot) {
	modelFactory.setModelRoot(modelRoot);
	entityFactory.setModelRoot(modelRoot);
};

exports.model = modelFactory.get;
exports.modelConstructor = modelFactory.getConstructor;
exports.entity = entityFactory.get;
exports.entityConstructor = entityFactory.getConstructor;


/**
 * @param {Request} req
 * @param {Response} res
 * @param {Function} callback
 */
exports.serveEntity = function (req, res, callback) {

	var namespace = _s.trim(req.url, '/').replace(/[\/\\]|\.js$/g, '');

	return entityFactory.getClientJsModificationTime(namespace, function (error, result) {
		if (error !== null) {
			callback(error);
		} else {
			res.set('Last-Modified', result);
			if (req.fresh) {
				res.status(304).end();
			} else {
				entityFactory.getClientJs(namespace, function (error, content) {
					if (error !== null) {
						callback(error);
					} else {
						res.set('Content-Type', 'text/javascript');
						res.set('Content-Length', content.length);
						res.end(content);
					}
				});
			}
		}
	});

};