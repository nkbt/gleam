'use strict';

var _ = require('underscore');
var factory = require('./entity-factory').get;

module.exports = function (json) {

	return JSON.parse(json, function (key, value) {
		if (_.isObject(value) && !_.isUndefined(value.__ns)) {
			var ns = value.__ns;
			delete value.__ns;
			return factory(ns, value);
		}
		return value;
	});
};
