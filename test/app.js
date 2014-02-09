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
		var userJson, userListJson;

		before(function () {
			userJson = requireText('./fixtures/user.json', 'UTF-8');
			userListJson = requireText('./fixtures/user-list.json', 'UTF-8');
		});

		it('should return UserEntity from user.json', function () {
			var entity = gleam.fromJson(userJson);
			expect(entity).to.be.an('object');
			expect(gleam.is(entity, 'user')).to.be.true;
			expect(entity.id()).to.equal(1);
		});
		it('should return array of UserEntity from user-list.json', function () {
			var list = gleam.fromJson(userListJson);
			expect(list).to.be.an('array');
			expect(list).to.have.length(2);
			expect(gleam.is(list[0], 'user')).to.be.true;
			expect(list[0].id()).to.equal(1);
			expect(gleam.is(list[1], 'user')).to.be.true;
			expect(list[1].id()).to.equal(2);
		});
	});


	describe('#build', function () {
		var out = path.join(__dirname, 'fixtures', 'out'),
			userRequireJs;

		before(function () {
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

});
