"use strict";

var path = require('path');
var expect = require('chai').expect;
var gleamFactory = require(path.join(__dirname, '..', 'lib', 'index'));
var requireText = require('./support/require-text');

describe('Entity', function () {
	var gleam, userData, userWithTestData;

	before(function () {
		gleam = gleamFactory(path.join(__dirname, 'fixtures', 'gleams'));
		userData = require('./fixtures/user.json');
		userWithTestData = requireText('./fixtures/user-with-test.json');
	});

	it('should have undefined initial values', function () {
		var entity = gleam.entity('user');
		expect(entity.initial().id).to.be.undefined;
		expect(entity.initial().name).to.be.undefined;
		expect(entity.initial().email).to.be.undefined;
	});

	it('should not have modified status', function () {
		var entity = gleam.entity('user');
		expect(entity.modified().id).to.be.false;
		expect(entity.modified().name).to.be.false;
		expect(entity.modified().email).to.be.false;
	});

	describe('#set', function () {
		var entity;
		beforeEach(function () {
			entity = gleam.entity('user');
		});

		it('should only accept simple objects and throw error otherwise', function () {

			expect(function () {
				return entity.set({id: 1});
			}).to.not.throw(Error);
			expect(function () {
				return entity.set('Hello, world!');
			}).to.throw('Values must be an object');
			expect(function () {
				return entity.set(['hello', 'world']);
			}).to.throw('Values must be an object');
			expect(function () {
				return entity.set(function () {
				});
			}).to.throw('Values must be an object');

		});

		it('should set valid values', function () {
			entity.set(userData);
			expect(entity.id()).to.equal(userData.id);
			expect(entity.name()).to.equal(userData.name);
			expect(entity.email()).to.equal(userData.email);
		});

		it('should throw descriptive error for invalid data', function () {
			expect(function () {
				entity.set({email: 'wrong-email'});
			}).to.throw('Value [wrong-email] is not valid for [user.email]');
		});

		it('should set modified flag for set values', function () {
			entity.set({id: 1});
			expect(entity.modified().id).to.be.true;
			expect(entity.modified().email).to.be.false;
		});

		it('should not modify initial', function () {
			entity.set({id: 1});
			expect(entity.initial().id).to.be.undefined;
		});

	});

	describe('#get', function () {

		it('should return simple object with current entity values', function () {
			var entity = gleam.entity('user', userData);
			expect(entity.get()).to.deep.equal({id: 1, name: "Nik", email: "nik@butenko.me"});
		});

		it('should return simple object with all nested entities simplified', function () {
			var entity = gleam.fromJson(userWithTestData);
			expect(entity.get()).to.deep.equal({id: 1, name: "Nik", email: "nik@butenko.me", test: {id: 2}});
		});

	});


	describe('#getProperty', function () {
		var entity;
		beforeEach(function () {
			entity = gleam.entity('user', userData);
		});

		it('should return value for requested property', function () {
			expect(entity.getProperty('id')).to.equal(1);
		});

		it('should throw descriptive error in case of accessing undefined property', function () {
			expect(function () {
				entity.getProperty('wrong');
			}).to.throw('Accessing undefined property [user.wrong]');
		});

	});

	describe('#getFlat', function () {

		it('should return simple object with stripped nested entities', function () {
			var entity = gleam.fromJson(userWithTestData);
			expect(entity.getFlat()).to.deep.equal({id: 1, name: "Nik", email: "nik@butenko.me"});
		});

	});

	describe('#initial', function () {

	});

	describe('#modified', function () {

	});

	describe('#is', function () {

	});

	describe('#toJSON', function () {

	});


	describe('#toString', function () {

	});


});
