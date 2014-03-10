"use strict";

/**
 * @module SetterGetterEntity
 */
var SetterGetterEntity = {
	id: function () {
	},
	constant: function () {
	},
	name: function () {
	},
	address: function () {
	},
	email: function () {
	},
	password: function () {
	},
	_getName: function () {
		return 'Always';
	},
	_getAddress: function (self) {
		return self.name();
	},
	_getConstant: function () {
		return 42;
	},
	/**
	 * @param value
	 * @param context
	 * @param {SetterGetterEntity} self
	 * @private
	 */
	_setId: function (value, context, self) {
		return self.constant() + value;
	},
	_setPassword: function (value, context) {
		return context.password2;
	},
	_setEmail: function () {
		return 'always@email.com';
	}
};

exports.Entity = SetterGetterEntity;
