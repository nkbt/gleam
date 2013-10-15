'use strict';

var path = require('path');
var _ = require('underscore');
var _s = require('underscore.string');
var async = require('async');
var fs = require('fs');
var Entity = require('./entity').Entity;

var root = null;

/**
 * @param {String} _root
 */
exports.setRoot = function (_root) {
	root = _root;
};


var getConstructor = _.memoize(function (namespace) {
	if (_.isEmpty(root)) {
		throw new Error("Model root not set. Use .setRoot() in app configuration section");
	}
	var schema = require(path.join(root, namespace)).Entity;
	if (!_.isObject(schema)) {
		throw new Error("Entity must be an object");
	}
	return function (defaults) {
		return new Entity(namespace, schema, defaults);
	};
});


exports.get = function (namespace, data) {
	return new (getConstructor(namespace))(data);
};


var getClientJsFiles = function (namespace) {
	var files;
	if (namespace === 'from-json') {
		files = [
			path.join(__dirname, 'browser', 'from-json.js')
		];
	} else if (namespace === 'abstract') {
		files = [
			path.join(__dirname, 'browser', 'abstract.js'),
			path.join(__dirname, 'entity.js')
		];
	} else {
		var parts = _s.dasherize(namespace).replace(/[^a-z\/]+/i, '').split('/');
		parts.unshift(root);
		files = [
			path.join(__dirname, 'browser', 'entity') + '.js',
			path.join.apply(path, parts) + '.js'
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
			// The first element is "browser" file wrapper with //%CONTENT inside
			var wrapper = results.shift(),
				content = results.join('\n').replace("'use strict';", '');
			// TODO: better sanity check
			//			var source = this.responseText.match(/^\s*(?:(['"]use strict['"])(?:;\r?\n?|\r?\n))?\s*((?:.*\r?\n?)*)/);
			//			eval('(function(){'+source[1]+';var exports=window.require.cache[\''+url+'\'];\n\n'+source[2]+'\n})();\n//@ sourceURL='+url+'\n');
			return callback(
				null,
				wrapper
					.replace('//%CONTENT', content)
					.replace('//%NAMESPACE', namespace)
			);
		}
	);
};

exports.getClientJs = async.memoize(getClientJs);
exports.getClientJsModificationTime = async.memoize(getClientJsModificationTime);