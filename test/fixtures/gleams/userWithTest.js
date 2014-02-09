"use strict";

/**
 * @module UserWithTestEntity
 */
var UserWithTestEntity = {
	id: function () {
	},
	name: function () {
	},
	email: function () {
	},
	test: function () {
	},
	_validateTest: function (test) {
		return test.toString && test.toString() === '[object Gleam:user/test]';
	}
};

exports.Entity = UserWithTestEntity;
