/*jshint browser:true */
/*global define: false, require:false, requirejs:false */


define(['underscore', 'entity/abstract'], function (_, Entity) {
	"use strict";

	var exports = {Entity: null},
		__namespace = "//%NAMESPACE";

	//%CONTENT

	return function (defaults) {
		return new Entity(__namespace, exports.Entity, defaults);
	};
});
