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


function abstract(namespace, schema, defaults) {
	var object = {},
		setters = {},
		getters = {},
		validators = {};

	defineProperty(object, '_data', {});
	defineProperty(object, '_gleam', namespace);

	function set(values) {
		if (!_.isObject(values) || _.isArray(values) || _.isFunction(values)) {
			throw new Error('Values must be an object');
		}
		_.each(values, function (value, key) {
			return setKey(key, value, values);
		});
	}

	function get() {
		var data = {};
		_.each(object._data, function (property, key) {
			var value = getKey(key);
			if (_.isArray(value)) {
				data[key] = [];
				_.each(value, function (item) {
					if (_.isObject(item) && !_.isEmpty(item._gleam)) {
						data[key].push(item.get());
					} else {
						data[key].push(item);
					}
				});
			} else if (_.isObject(value) && !_.isEmpty(value._gleam)) {
				data[key] = value.get();
			} else {
				data[key] = value;
			}
		});
		return data;
	}


	function isValid(key, value, values) {
		if (_.isUndefined(values)) {
			values = {};
			values[key] = value;
		}
		if (!_.has(schema, key)) {
			return false;
		}
		if (_.has(validators, key)) {
			return validators[key](value, values, object);
		}
		return true;
	}


	function setValue(key, value, values) {
		if (_.has(setters, key)) {
			object._data[key].value = setters[key](value, values, object);
		} else {
			object._data[key].value = value;
		}
		object._data[key].modified = true;
		return object;
	}


	function setKey(key, value, values) {
		if (isValid(key, value, values)) {
			return setValue(key, value, values);
		}
		if (_.has(schema, key)) {
			throw new Error('Value [' + value + '] is not valid for [' + namespace + '.' + key + ']');
		}
		return object;
	}


	function getKey(key) {
		if (!_.has(object._data, key)) {
			throw new Error('Accessing undefined property [' + namespace + '.' + key + ']');
		}
		if (_.has(getters, key)) {
			return getters[key](object);
		}
		return object._data[key].value;
	}


	_.each(schema, function (value, key) {
		if (!_.isFunction(value)) {
			throw new Error('Entity schema must not have any properties [' + namespace + '.' + key + ']');
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
			initial: value(),
			modified: false,
			value: value()
		};

		defineProperty(object, key, function (value) {
			if (_.isUndefined(value)) {
				return getKey(key);
			}
			setKey(key, value);
			return object;
		}, true);
	});


	function getFlat() {
		var data = {};
		_.each(object._data, function (property, key) {
			if (_.isArray(property.value)) {
				data[key] = [];
				_.each(property.value, function (item) {
					if (!_.isObject(item) || _.isEmpty(item._gleam)) {
						data[key].push(item);
					}
				});
			} else if (!_.isObject(property.value) || _.isEmpty(property.value._gleam)) {
				data[key] = property.value;
			}
		});
		return data;
	}


	function toJson() {
		var data = {};
		_.each(object._data, function (property, key) {
			if (_.isArray(property.value)) {
				data[key] = [];
				_.each(property.value, function (item) {
					if (_.isObject(item) && !_.isEmpty(item._gleam)) {
						data[key].push(item.toJSON());
					} else {
						data[key].push(item);
					}
				});
			} else if (_.isObject(property.value) && !_.isEmpty(property.value._gleam)) {
				data[key] = property.value.toJSON();
			} else {
				data[key] = property.value;
			}
		});
		data.__ns = namespace;
		return data;
	}


	setProperties(object, {
		set: set,
		get: get,
		getProperty: getKey,
		getFlat: getFlat,
		initial: function () {
			return plucker(object._data, 'initial');
		},
		modified: function () {
			return plucker(object._data, 'modified');
		},
		is: function (ns) {
			return ns === namespace;
		},
		isValid: isValid,
		toJSON: toJson,
		toString: function () {
			return ['[', 'object', ' ', 'Gleam:', namespace, ']'].join('');
		}
	});


	if (defaults) {
		set(defaults);

		// Set modified key back to false and fill initial value
		_.each(object._data, function (property) {
			property.modified = false;
			property.initial = property.value;
		});
	}


	return object;
}


module.exports = exports = abstract;
