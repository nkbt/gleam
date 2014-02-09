"use strict";

var _ = require('underscore');

function is(root) {
	return function (entity, namespace) {
		return !_.isEmpty(entity) &&
			_.isObject(entity) &&
			_.isFunction(entity.is) &&
			entity.is(namespace);
	};
}

module.exports = exports = is;
