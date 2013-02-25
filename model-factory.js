'use strict';

var path = require('path');
var _ = require('underscore');
var async = require('async');

var modelRoot = null;
var constructors = {};
var instances = {};

/**
 * @private
 * @param {String} namespace
 * @return {AbstractModel.prototype.constructor}
 */
var getConstructor = function (namespace) {
	if (_.isEmpty(modelRoot)) {
		throw new Error("Model root not set. Use .setModelRoot() in app configuration section");
	}
	if (_.isUndefined(constructors[namespace])) {
		constructors[namespace] = require('./inherit').inherit(
			require('./model').AbstractModel,
			require(path.join(modelRoot, namespace, namespace + '-model')).Model
		);
		constructors[namespace].prototype.namespace = namespace;
	}

	return constructors[namespace];
};


/**
 * @private
 * @param {String} namespace
 * @return {AbstractModel}
 */
var get = function (namespace) {
	if (_.isUndefined(instances[namespace])) {
		instances[namespace] = new (getConstructor(namespace))(namespace);
	}
	return instances[namespace];
};

/**
 * @param {String} _modelRoot
 */
exports.setModelRoot = function (_modelRoot) {
	modelRoot = _modelRoot;
};


/**
 * @param {String} namespace
 * @return {AbstractModel.prototype.constructor}
 */
exports.getConstructor = getConstructor;


/**
 * @param {String} namespace
 * @return {AbstractModel}
 */
exports.get = get;