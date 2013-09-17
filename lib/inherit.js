'use strict';

var _ = require('underscore');

function mixinValue(value, key) {
	if (_.isFunction(value)) {
		this[key] = _.bind(value, this);
		return;
	}
	if (_.isArray(value)) {
		this[key] = value.slice(0);
	} else if (_.isObject(value)) {
		this[key] = _.clone(value);
	} else if (_.isNumber(value) || _.isBoolean(value) || _.isString(value)) {
		this[key] = value;
	} else {
		if (!this) {
			console.log('OMG', this);
			throw new Error('OMG');
			
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
	return Constructor;
};
