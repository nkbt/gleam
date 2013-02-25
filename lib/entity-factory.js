'use strict';

var path = require('path');
var _ = require('underscore');
var _s = require('underscore.string');
var async = require('async');
var fs = require('fs');

var modelRoot = null;

/**
 * @param {String} _modelRoot
 */
exports.setModelRoot = function (_modelRoot) {
	modelRoot = _modelRoot;
};


var constructors = {};

/**
 * @param {String} namespace
 * @return {AbstractEntity.prototype.constructor}
 */
var getConstructor = function (namespace) {
	if (_.isEmpty(modelRoot)) {
		throw new Error("Model root not set. Use .setModelRoot() in app configuration section");
	}
	if (_.isUndefined(constructors[namespace])) {
		constructors[namespace] = require('./inherit').inherit(
			require('./entity').AbstractEntity,
			require(path.join(modelRoot, namespace, namespace + '-entity')).Entity
		);
		constructors[namespace].prototype.namespace = namespace;
	}

	return constructors[namespace];
};

/**
 * @param {String} namespace
 * @return {AbstractEntity.prototype.constructor}
 */
exports.getConstructor = getConstructor;

exports.get = function (namespace, data) {
	return new (exports.getConstructor(namespace))(data);
};


var getClientJsFiles = function (namespace) {
	var files;
	if (namespace === 'inherit') {
		files = [
			path.join(__dirname, 'browser', 'inherit.js'),
			path.join(__dirname, 'inherit.js')
		];
	} else if (namespace === 'abstract') {
		files = [
			path.join(__dirname, 'browser', 'abstract.js'),
			path.join(__dirname, 'entity.js')
		];
	} else {
		files = [
			path.join(__dirname, 'browser', 'entity.js'),
			path.join(modelRoot, namespace, _s.dasherize(namespace) + '-entity.js')
		];
	}
	return files;
};


var getClientJsModificationTime = function (namespace, callback) {

	async.map(getClientJsFiles(namespace), fs.stat, function (error, results) {
		if (error !== null) {
			return callback(error);
		}
		return callback(null, _(results).reduce(function (lastModified, stat) {
			return lastModified > stat.mtime ? lastModified : stat.mtime;
		}, 0));
	});
};


var getClientJs = function (namespace, callback) {

	return async.parallel(
		getClientJsFiles(namespace).map(function (filepath) {
			return async.apply(fs.readFile, filepath, 'UTF-8');
		}),
		function (error, results) {
			if (error !== null) {
				return callback(error);
			}
//			var source = this.responseText.match(/^\s*(?:(['"]use strict['"])(?:;\r?\n?|\r?\n))?\s*((?:.*\r?\n?)*)/);
//			eval('(function(){'+source[1]+';var exports=window.require.cache[\''+url+'\'];\n\n'+source[2]+'\n})();\n//@ sourceURL='+url+'\n');
			return callback(null, results[0].replace('//%CONTENT', results[1].replace("'use strict';", '')));
		}
	);
};

exports.getClientJs = async.memoize(getClientJs);
exports.getClientJsModificationTime = async.memoize(getClientJsModificationTime);