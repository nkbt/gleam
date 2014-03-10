'use strict';

var _ = require('underscore');
var entity = require('./entity');


function fromJson(root, json) {
	return JSON.parse(json, function (key, value) {
		if (_.isObject(value) && !_.isUndefined(value.__ns)) {
			var namespace = value.__ns;
			delete value.__ns;
			return entity(root, namespace, value);
		}
		return value;
	});
}

module.exports = exports = fromJson;
