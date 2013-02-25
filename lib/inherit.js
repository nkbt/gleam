'use strict';

var _ = require('underscore');

exports.inherit = function (Parent, ChildPrototype) {
	var Constructor, _ChildPrototype = _(ChildPrototype).chain();

	Constructor = function () {
		_ChildPrototype.each(function (value, key) {
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
				this[key] = null;
			}
		}, this);
		Parent.apply(this, arguments);
		this.init();
	};
	Constructor.prototype = new Parent();
	Constructor.prototype.constructor = Constructor;

	_ChildPrototype.functions().each(function (key) {
		Constructor.prototype[key] = ChildPrototype[key];
	});

	return Constructor;
};
