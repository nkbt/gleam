'use strict';

var _ = require('underscore');

function mixinValue(value, key) {
	var _value = _(value);
	if (_value.isFunction()) {
		return;
	}
	if (_value.isArray()) {
		this[key] = _value.slice(0);
	} else if (_value.isObject()) {
		this[key] = _value.clone();
	} else if (_value.isNumber() || _value.isBoolean() || _value.isString()) {
		this[key] = _value.value();
	} else {
		if (!this) {
			console.log('aaaaaa', this);
			throw new Error('aaaaaaa');
			
		}
		this[key] = null;
	}
}

exports.inherit = function (Parent, ChildPrototype) {
	var Constructor = function () {
		_.each(ChildPrototype, mixinValue, this);
		Parent.apply(this, _.toArray(arguments));
		this.init();
	};
	Constructor.prototype = new Parent();
	Constructor.prototype.constructor = Constructor;

	_.each(_.functions(ChildPrototype), function (key) {
		Constructor.prototype[key] = ChildPrototype[key];
	});

	return Constructor;
};
