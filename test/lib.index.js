"use strict";

var path = require('path');
var requireText = require('./support/require-text');
var expect = require('chai').expect;
var fs = require('fs');
var rimraf = require('rimraf');
var gleamFactory = require(path.join(__dirname, '..', 'lib', 'index'));

describe('Gleam', function () {
	var gleam;

	before(function () {
		gleam = gleamFactory(path.join(__dirname, 'fixtures', 'gleams'));
	});

	it('should have expected methods', function () {
		expect(gleam).to.have.keys('entity', 'is', 'fromJson', 'buildSync');
		expect(gleam.entity).to.be.a('function');
		expect(gleam.is).to.be.a('function');
		expect(gleam.fromJson).to.be.a('function');
		expect(gleam.buildSync).to.be.a('function');
	});

});
