"use strict";

var regexp = new RegExp('\\s+', 'g');
module.exports = exports = function (string) {
	return string.replace(regexp, '');
};
