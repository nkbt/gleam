"use strict";

var path = require('path');
var expect = require('chai').expect;
var Gleam = require(path.join(__dirname, '..', 'index'));

describe('Gleam#is', function () {
	var gleam, entity;

	before(function () {
		gleam = new Gleam(path.join(__dirname, 'fixtures', 'gleams'));
	});

	beforeEach(function () {
		entity = gleam.entity('user');
	});

	it('should match UserEntity to be instance of "user"', function () {
		expect(Gleam.is(entity, 'user')).to.be.true;
	});

	it('should not match UserEntity to be instance of "not/user"', function () {
		expect(Gleam.is(entity, 'not/user')).to.be.false;
	});

	it('should not match wrong input to be instance of "user"', function () {
		expect(Gleam.is('Not an object', 'user')).to.be.false;
	});

});
