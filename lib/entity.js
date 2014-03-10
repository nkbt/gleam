"use strict";

var abstract = require('./abstract');
var path = require('path');
var _ = require('underscore');


function entity(root, namespace, data) {
	var schema = require(path.join(root, namespace)).Entity;
	if (!_.isObject(schema)) {
		throw new Error("Entity must be an object");
	}
	return abstract(namespace, schema, data);
}

module.exports = exports = entity;
