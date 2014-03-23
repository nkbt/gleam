"use strict";

var fs = require('fs');
var path = require('path');
module.exports = exports = function (file) {
	var filePath = path.join(__dirname, '..', file);
	return fs.readFileSync(filePath, 'UTF-8');
};
