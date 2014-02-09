"use strict";

var path = require('path');
var requireText = require('./support/require-text');
var expect = require('chai').expect;
var gleamFactory = require(path.join(__dirname, '..', 'lib', 'index'));

describe('Gleam', function () {
	var gleam;

	before(function () {
		gleam = gleamFactory(path.join(__dirname, 'fixtures', 'gleams'));
	});


	it('should have expected methods', function () {
		expect(gleam).to.have.keys('entity', 'is', 'fromJson', 'browserJs');
	});


	describe('#entity', function () {

		it('should create UserEntity', function () {
			/* @type UserEntity entity */
			var entity = gleam.entity('user');
			expect(entity).to.be.an('object');
			expect(entity).to.have.keys('id', 'name', 'email');
		});

	});


	describe('#is', function () {
		/* @type UserEntity entity */
		var entity;

		before(function () {
			entity = gleam.entity('user');
		});

		it('should match UserEntity to be instance of "user"', function () {
			expect(gleam.is(entity, 'user')).to.be.true;
		});

		it('should not match UserEntity to be instance of "not/user"', function () {
			expect(gleam.is(entity, 'not/user')).to.be.false;
		});

		it('should not match wrong input to be instance of "user"', function () {
			expect(gleam.is('Not an object', 'user')).to.be.false;
		});

	});


	describe('#fromJson', function () {
		/* @type UserEntity entity */
		var entity,
			json = requireText('./fixtures/user.json', 'UTF-8');

		before(function () {
			entity = gleam.fromJson(json);
		});

		it('should return UserEntity', function () {
			expect(entity).to.be.an('object');
			expect(gleam.is(entity, 'user')).to.be.true;
		});
	});


	describe('#browserJs', function () {
		var js;

		before(function () {
			js = gleam.browserJs('user');
		});

		it('should return string', function () {
			expect(js).to.be.a('string');
		});

		it('should return valid RequireJS module', function () {
			expect(js).to.be.equal(requireText('./fixtures/user.requirejs.txt', 'UTF-8'));
		});

	});

});
