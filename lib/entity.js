'use strict';

var _ = require('underscore');

function ucfirst(property) {
	return property.charAt(0).toUpperCase() + property.substr(1, property.length - 1);
}

/**
 * @param {Object} data
 * @constructor
 */
var AbstractEntity = function (data) {
	if (!this.__init) {
		this.__init = true;
		return;
	}
	if (_(data).isObject()) {
		this.set(data);
	}
};

/**
 * @lends AbstractEntity
 */
AbstractEntity.prototype = {

	/**
	 * @private
	 */
	init: function () {
	},

	/**
	 * @param {String|Object} key
	 * @param {*|undefined} value
	 * @returns {AbstractEntity}
	 */
	set: function (key, value) {
		var data;

		if (_.isUndefined(value)) {
			data = key;
			if (!_.isObject(data)) {
				throw new Error('Data must be an object');
			}
		} else {
			data = {};
			data[key] = value;
		}


		// Validate data
		_.each(_.keys(this.get()), function (property) {
			if (!this.validate(property, data[property])) {
				throw new Error('Value [' + data[property] + '] is not valid for [' + this.namespace + '.' + property + ']');
			}
		}, this);

		// Set data
		_.each(_.keys(data), function (property) {

			if (!_.has(this, property)) {
				throw new Error('Trying to set non-existing property [' + this.namespace + '.' + property + ']');
			}

			var setter = 'set' + ucfirst(property);
			if (_.isFunction(this[setter])) {
				this[setter](data[property]);
			} else {
				this[property] = data[property];
			}

		}, this);

		return this;
	},

	/**
	 * @param {String} key
	 * @param {*} value
	 * @returns {AbstractEntity}
	 */
	push: function (key, value) {
		var old;
		if (!_.isArray(this[key])) {
			throw new Error('Property must be an array');
		}
		old = this.get(key);
		old.push(value);

		return this.set(key, old);
	},

	/**
	 * @param {String} property
	 * @returns {*}
	 */
	get: function (property) {

		var data, getter;

		if (_.isUndefined(property)) {

			data = {};
			_.each(_.keys(this), function (property) {
				if (!_.isFunction(this[property])) {
					data[property] = this[property];
				}
			}, this);

		} else {

			if (!_.has(this, property) || _.isFunction(this[property])) {
				throw new Error('Trying to access non-existing property: ' + this.namespace + '.' + property);
			}

			getter = 'get' + ucfirst(property);
			if (_.isFunction(this[getter])) {
				data = this[getter](property);
			} else {
				data = this[property];
			}

		}

		return data;
	},

	/**
	 *
	 * @private
	 * @param {String} property
	 * @param {*} value
	 * @returns {boolean}
	 */
	validate: function (property, value) {
		var validator, isValid = true;
		validator = 'validate' + ucfirst(property);
		if (_.isFunction(this[validator])) {
			isValid = this[validator](value);
		}
		return isValid;
	},

	toJSON: function () {
		var data = this.get();
		data.__ns = this.namespace;
		return data;
	}

};

exports.AbstractEntity = AbstractEntity;