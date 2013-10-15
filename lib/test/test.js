"use strict";

exports.Entity = {
	id: null,
	name: null,
	timestamp: null,
	getTimestamp: function() {
		return (new Date()).getTime()
	}
};