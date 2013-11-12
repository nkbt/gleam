'use strict';

var _ = require('underscore');


function ucfirst(property) {
	return [property.charAt(0).toUpperCase(), property.substr(1)].join('');
}

function lcfirst(property) {
	return [property.charAt(0).toLowerCase(), property.substr(1)].join('');
}

function plucker(data, property) {
	return _.object(_.keys(data), _.pluck(data, property));
}

function Entity(namespace, schema, defaults) {

	var object = {
			_data: {}
		},
		setters = {},
		getters = {},
		validators = {};

	Object.defineProperty(object, 'namespace', {
		enumerable: true,
		configurable: false,
		writable: false,
		value: namespace
	});

	_.each(schema, function (value, key) {

		if (_.isFunction(value)) {
			if (key.substr(0, 3) === 'set') {
				setters[lcfirst(key.substr(3))] = value;
				return null;
			}
			if (key.substr(0, 3) === 'get') {
				getters[lcfirst(key.substr(3))] = value;
				return null;
			}
			if (key.substr(0, 8) === 'validate') {
				validators[lcfirst(key.substr(8))] = value;
				return null;
			}
		} else {
			object._data[key] = {
				initial: value,
				modified: false,
				value: value
			};

			Object.defineProperty(object, 'get' + ucfirst(key), {
				enumerable: false,
				configurable: false,
				writable: false,
				value: function () {
					return getKey(key);
				}
			});
			Object.defineProperty(object, 'set' + ucfirst(key), {
				enumerable: false,
				configurable: false,
				writable: false,
				value: function (value) {
					return setKey(key, value);
				}
			});

			return object._data[key];
		}

		return null;
	});


	function set(values) {
		_.each(values, function (value, key) {
			return setKey(key, value, values);
		});
	}


	function get() {
		return _.object(_.keys(object._data), _.map(_.keys(object._data), getKey));
	}


	function setKey(key, value, values) {
		if (_.isUndefined(values)) {
			values = {};
			values[key] = value;
		}
		if (!_.has(schema, key)) {
			return;
			// throw new Error('Setting undefined property'); // Too much strictness
		}
		if (_.has(validators, key) && !validators[key](value, values, object._data)) {
			throw new Error('Value [' + value + '] is not valid for [' + namespace + '.' + key + ']');
		}
		if (_.has(setters, key)) {
			value = setters[key](value, values, get());
		}
		object._data[key].value = value;
		object._data[key].modified = true;
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


	if (defaults !== undefined) {
		set(defaults);
	}


	Object.defineProperty(object, 'set', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: set
	});

	Object.defineProperty(object, 'get', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: get
	});
	Object.defineProperty(object, 'getProperty', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: getKey
	});
	Object.defineProperty(object, 'getFlat', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function () {
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
		}
	});
	Object.defineProperty(object, 'initial', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function () {
			return plucker(object._data, 'initial');
		}
	});
	Object.defineProperty(object, 'modified', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function () {
			return plucker(object._data, 'modified');
		}
	});
	Object.defineProperty(object, 'is', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function (ns) {
			return ns === namespace;
		}
	});
	Object.defineProperty(object, 'toJSON', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function () {
			var rawData = get();
			rawData.__ns = namespace;
			return rawData;
		}
	});
	Object.defineProperty(object, 'toString', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function () {
			return ['[', 'object', ' ', 'Gleam:', namespace, ']'].join('');
		}
	});
	return object;
}


exports.Entity = Entity;