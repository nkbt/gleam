"use strict";

var path = require('path');
var requireText = require('./support/require-text');
var expect = require('chai').expect;
var fs = require('fs');
var rimraf = require('rimraf');
var spaceFix = require('./support/space-fix');
var gleamFactory = require(path.join(__dirname, '..', 'index'));

describe('Gleam#build', function () {
	var gleam, outDir, jsOut, jsIn;

	before(function () {
		outDir = path.join(__dirname, 'fixtures', 'out');
		gleam = gleamFactory(path.join(__dirname, 'fixtures', 'gleams'));
		fs.mkdirSync(outDir);
		gleam.buildSync(outDir);
		jsOut = requireText('./fixtures/out/user.js');
		jsIn = requireText('./fixtures/user.requirejs.txt');
	});

	after(function () {
		rimraf.sync(outDir);
	});

	it('should return spaceFix', function () {
		expect(jsOut).to.be.a('string');
	});

	it('should return valid RequireJS module', function () {
		expect(spaceFix(jsOut)).to.be.equal(spaceFix(jsIn));
	});

});
