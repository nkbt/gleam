"use strict";
/*jshint browser:true */
/*jslint browser:true */


define(['underscore', 'entity/abstract', 'entity/inherit'], function () {

	var exports = {Entity: null};

	//%CONTENT

	return require('entity/inherit').inherit(require('entity/abstract'), exports.Entity);
});
