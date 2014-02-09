"use strict";

var abstract = require('./abstract');
var path = require('path');
var _ = require('underscore');


function factory(root, namespace, data) {
	var schema = require(path.join(root, namespace)).Entity;
	if (!_.isObject(schema)) {
		throw new Error("Entity must be an object");
	}
	return abstract(namespace, schema, data);
}


function entity(root) {
	return function (namespace, data) {
		return factory(root, namespace, data);
	};
}


module.exports = exports = entity;
