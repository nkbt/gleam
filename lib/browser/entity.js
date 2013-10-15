"use strict";
/*jshint browser:true */
/*jslint browser:true */


define(['underscore', 'entity/abstract'], function (_, Entity) {

	var exports = {Entity: null};
	var __namespace = "//%NAMESPACE";

	//%CONTENT

	return function (defaults) {
		return new Entity(__namespace, exports.Entity, defaults);
	};
});
