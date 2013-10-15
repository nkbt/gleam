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

	var object = {},
		data = {},
		setters = {},
		getters = {},
		validators = {};

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
			data[key] = {
				initial: value,
				modified: false,
				value: value
			};
			object['get' + ucfirst(key)] = function () {
				return getKey(key);
			};
			object['set' + ucfirst(key)] = function (value) {
				return setKey(key, value);
			};
			return data[key];
		}

		return null;
	});


	function set(values) {
		_.each(values, function (value, key) {
			return setKey(key, value, values);
		});
	}


	function get() {
		return _.object(_.keys(data), _.map(_.keys(data), getKey));
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
		if (_.has(validators, key) && !validators[key](value, values, data)) {
			throw new Error('Value [' + value + '] is not valid for [' + namespace + '.' + key + ']');
		}
		if (_.has(setters, key)) {
			value = setters[key](value, values, get());
		}
		data[key].value = value;
		data[key].modified = true;
	}


	function getKey(key) {
		if (!_.has(data, key)) {
			throw new Error('Accessing undefined property');
		}
		if (_.has(getters, key) && _.isEmpty(data[key].value)) {
			return getters[key](plucker(data, 'value'), object);
		}
		return data[key].value;
	}


	if (defaults !== undefined) {
		set(defaults);
	}


	object.set = set;
	object.get = get;
	object.initial = function () {
		return plucker(data, 'initial');
	};
	object.modified = function () {
		return plucker(data, 'modified');
	};
	object.is = function (ns) {
		return ns === namespace;
	};
	object.toJSON = function () {
		var rawData = get();
		rawData.__ns = namespace;
		return rawData;
	};

	return object;
}


exports.Entity = Entity;