"use strict";
/*jshint browser:true */
/*jslint browser:true */
/*global define: false, require:false, requirejs:false */

define(['underscore'], function (_) {

	var nsList = [], fillNs, restoreJson;
	fillNs = function (key, value) {
		if (key === '__ns') {
			nsList.push("entity/" + value);
		}
		return undefined;
	};

	restoreJson = function (key, value) {
		if (_.isObject(value) && !_.isUndefined(value.__ns)) {
			var Entity = require('entity/' + value.__ns);
			delete value.__ns;
			return new Entity(value);
		}
		return value;
	};

	return function (json, callback) {
		// TODO: write proper unit tests
		//		json = '{' +
		//			'	"redirect":null,' +
		//			'	"message":[],' +
		//			'	"payload":[{' +
		//			'		"id":null,' +
		//			'		"data":{"name":"test","price":100,"expireTime":"2013-02-25T07:15:53.238Z","bid":{"max":null,"min":null,"internal":null,"external":null,"next":null},"__ns":"domain"},' +
		//			'		"type":"domain",' +
		//			'		"__ns":"payload"' +
		//			'	}],' +
		//			'	"__ns":"response"' +
		//			'}!1111';
		try {
			JSON.parse(json, fillNs);
		} catch (exc) {
			return callback(exc);
		}
		return requirejs(nsList, function () {
			try {
				return callback(null, JSON.parse(json, restoreJson));
			} catch (exc) {
				return callback(exc);
			}
		});
	};
});

