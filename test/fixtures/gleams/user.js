"use strict";

/**
 * @module UserEntity
 */
var UserEntity = {
	id: function () {
	},
	name: function () {
	},
	email: function () {
	},
	_validateEmail: function (value) {
		return value === 'nik@butenko.me';
	}
};

exports.Entity = UserEntity;
