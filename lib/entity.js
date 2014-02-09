"use strict";

var abstract = require('./abstract');
var path = require('path');
var _ = require('underscore');


var factory = _.memoize(function (root, namespace) {
	var schema = require(path.join(root, namespace)).Entity;
	if (!_.isObject(schema)) {
		throw new Error("Entity must be an object");
	}
	return abstract(namespace, schema);
});


function entity(root) {
	return function (namespace, data) {
		var Entity = factory(root, namespace);
		return new Entity(data);
	};
}

module.exports = exports = entity;
