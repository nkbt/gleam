/*global define: false, require: false */
define(['underscore'], function (_) {
	"use strict";

	var nsList = [], fillNs, restoreJson;
	fillNs = function (key, value) {
		if (key === '__ns') {
			nsList.push("entity/" + value);
		}
		return undefined;
	};

	restoreJson = function (key, value) {
		if (_.isObject(value) && !_.isUndefined(value.__ns)) {
			var Entity = require('entity/' + value.__ns);
			delete value.__ns;
			return new Entity(value);
		}
		return value;
	};

	return function (json, callback) {
		callback = _.last(arguments);
		json = _.first(arguments);

		try {
			JSON.parse(json, fillNs);
		} catch (exc) {
			return callback(exc);
		}
		return require(nsList, function () {
			var obj;
			try {
				obj = JSON.parse(json, restoreJson);
			} catch (exc) {
				return callback(exc);
			}
			return callback(null, obj);
		});
	};
});
