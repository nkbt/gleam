"use strict";

var entity = require('./entity');
var is = require('./is');
var fromJson = require('./from-json');
var buildSync = require('./build-sync');

/**
 * @param {String} root
 * @returns {{entity: *, is: *, fromJson: *}}
 */
function instance(root) {

	return {
		entity: entity(root),
		is: is(root),
		fromJson: fromJson(root),
		buildSync: buildSync(root)
	};
}


module.exports = exports = instance;
