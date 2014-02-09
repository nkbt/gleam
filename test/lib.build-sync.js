"use strict";

var path = require('path');
var requireText = require('./support/require-text');
var expect = require('chai').expect;
var fs = require('fs');
var rimraf = require('rimraf');
var gleamFactory = require(path.join(__dirname, '..', 'lib', 'index'));

describe('Gleam#build', function () {
	var gleam, out, userRequireJs;

	before(function () {
		out = path.join(__dirname, 'fixtures', 'out'),
			gleam = gleamFactory(path.join(__dirname, 'fixtures', 'gleams'));
		fs.mkdirSync(out);
		gleam.buildSync(out);
		userRequireJs = requireText('./fixtures/out/user.js', 'UTF-8');
	});

	after(function () {
		rimraf.sync(out);
	});

	it('should return string', function () {
		expect(userRequireJs).to.be.a('string');
	});

	it('should return valid RequireJS module', function () {
		expect(userRequireJs).to.be.equal(requireText('./fixtures/user.requirejs.txt', 'UTF-8'));
	});

});
