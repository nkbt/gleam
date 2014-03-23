"use strict";

var entity = require('./entity');
var is = require('./is');
var fromJson = require('./from-json');
var buildSync = require('./build-sync');
var _ = require('underscore');


/**
 * @constructor
 * @param root
 * @property _root
 */
function Gleam(root) {
	if (_.isEmpty(root)) {
		throw new Error('Root must be set');
	}
	this._root = root;
}


/**
 * @param {String} namespace
 * @param {Object?} data
 * @return {Entity}
 */
Gleam.prototype.entity = function (namespace, data) {
	return entity(this._root, namespace, data);
};


/**
 * @param {String} json
 * @return {*}
 */
Gleam.prototype.fromJson = function (json) {
	return fromJson(this._root, json);
};


/**
 * @function
 * @param {Object} entity
 * @param {String} namespace
 */
Gleam.is = is;


/**
 * @function
 * @param {String} input Input directory
 * @param {String} out Output directory
 */
Gleam.buildSync = buildSync;


module.exports = exports = Gleam;
