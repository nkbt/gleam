"use strict";

var entity = require('./entity');
var is = require('./is');
var fromJson = require('./from-json');

function browserJs(root) {
	return function (namespace) {
		return null;
	};
}

function instance(root) {

	return {
		entity: entity(root),
		is: is(root),
		fromJson: fromJson(root),
		browserJs: browserJs(root)
	};
}

module.exports = exports = instance;
