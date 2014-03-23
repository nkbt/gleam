"use strict";

var _ = require('underscore');

/**
 * @api
 * @static
 */
function is(entity, namespace) {
	return !_.isEmpty(entity) &&
		_.isObject(entity) &&
		_.isFunction(entity.is) &&
		entity.is(namespace);
}

module.exports = exports = is;
