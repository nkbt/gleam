'use strict';

var _ = require('underscore');


function lcfirst(property) {
	return [property.charAt(0).toLowerCase(), property.substr(1)].join('');
}


function plucker(data, property) {
	return _.object(_.keys(data), _.pluck(data, property));
}


function defineProperty(object, property, value, enumerable) {
	return Object.defineProperty(object, property, {
		enumerable: enumerable || false,
		configurable: false,
		writable: false,
		value: value
	});
}


function setProperties(object, properties) {
	return _.each(properties, function (value, key) {
		return defineProperty(object, key, value);
	});
}


function abstract(namespace, schema) {
	var object = {},
		setters = {},
		getters = {},
		validators = {};

	defineProperty(object, '_data', {});
	defineProperty(object, '_ns', namespace);

	function set(values) {
		_.each(values, function (value, key) {
			return setKey(key, value, values);
		});
	}


	function get() {
		return _.object(_.keys(object._data), _.map(_.keys(object._data), getKey));
	}


	function isValid(key, value, values) {
		if (_.isUndefined(values)) {
			values = {};
			values[key] = value;
		}
		if (!_.has(schema, key)) {
			return false;
		}
		if (_.has(validators, key) && !validators[key](value, values, object._data)) {
			throw new Error('Value [' + value + '] is not valid for [' + namespace + '.' + key + ']');
		}
		return true;
	}


	function setValue(key, value, values) {
		if (_.has(setters, key)) {
			object._data[key].value = setters[key](value, values, get());
		}
		object._data[key].value = value;
	}


	function setKey(key, value, values) {
		if (isValid(key, value, values)) {
			setValue(key, value, values);
		}
	}


	function getKey(key) {
		if (!_.has(object._data, key)) {
			throw new Error('Accessing undefined property');
		}
		if (_.has(getters, key) && _.isEmpty(object._data[key].value)) {
			return getters[key](plucker(object._data, 'value'), object);
		}
		return object._data[key].value;
	}


	_.each(schema, function (value, key) {
		if (!_.isFunction(value)) {
			return;
		}
		if (key.substr(0, 4) === '_set') {
			setters[lcfirst(key.substr(4))] = value;
			return;
		}
		if (key.substr(0, 4) === '_get') {
			getters[lcfirst(key.substr(4))] = value;
			return;
		}
		if (key.substr(0, 9) === '_validate') {
			validators[lcfirst(key.substr(9))] = value;
			return;
		}

		object._data[key] = {
			initial: value,
			modified: false,
			value: value
		};

		defineProperty(object, key, function (value) {
			if (_.isUndefined(value)) {
				return getKey(key);
			}
			setKey(key, value);
			object._data[key].modified = true;
			return object;
		}, true);
	});


	setProperties(object, {
		set: set,
		get: get,
		getProperty: getKey,
		getFlat: function () {
			var rawData = {
				__ns: namespace
			};
			_.each(get(), function (value, key) {
				if (!_.isObject(value) || _.isEmpty(value.namespace)) {
					rawData[key] = value;
				} else {
					rawData[key] = null;
				}
			});
			return rawData;
		},
		initial: function () {
			return plucker(object._data, 'initial');
		},
		modified: function () {
			return plucker(object._data, 'modified');
		},
		is: function (ns) {
			return ns === namespace;
		},
		toJSON: function () {
			var rawData = get();
			rawData.__ns = namespace;
			return rawData;
		},
		toString: function () {
			return ['[', 'object', ' ', 'Gleam:', namespace, ']'].join('');
		}
	});


	return function (defaults) {
		if (defaults) {

		}

		return object;
	};
}


module.exports = exports = abstract;
