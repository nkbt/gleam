"use strict";

var path = require('path');
var expect = require('chai').expect;
var Gleam = require(path.join(__dirname, '..', 'index'));
var requireText = require('./support/require-text');
var spaceFix = require('./support/space-fix');

describe('Entity', function () {
	var gleam, userData, userJson, userWithTestData, userWithTestJson;

	before(function () {
		gleam = new Gleam(path.join(__dirname, 'fixtures', 'gleams'));
		userData = require('./fixtures/user.json');
		userJson = requireText('./fixtures/user.json');
		userWithTestData = require('./fixtures/user-with-test.json');
		userWithTestJson = requireText('./fixtures/user-with-test.json');
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

	});


	describe('#isValid', function () {
		var entity;
		beforeEach(function () {
			entity = gleam.entity('user');
		});
		
		it('should return "true" for valid email passed', function () {
			expect(entity.isValid('email', 'nik@butenko.me')).to.be.true;
		});

		it('should return "false" for invalid email passed', function () {
			expect(entity.isValid('email', 'wrong@email')).to.be.false;
		});

	});


	describe('#get', function () {

		it('should return simple object with current entity values', function () {
			var entity = gleam.entity('user', userData);
			expect(entity.get()).to.deep.equal({id: 1, name: "Nik", email: "nik@butenko.me"});
		});

		it('should return simple object with all nested entities simplified', function () {
			var entity = gleam.fromJson(userWithTestJson);
			expect(entity.get()).to.deep.equal({id: 1, name: "Nik", email: "nik@butenko.me", test: {id: 2}});
		});

		it('should return simple object with all nested arrays of entities simplified', function () {
			var entity = gleam.fromJson(requireText('./fixtures/user-with-arrays.json'));
			expect(entity.get()).to.deep.equal({id: 1, name: "Nik", email: "nik@butenko.me", tests: [{id: 2}, {id: 3}], messages: ["Message 1", "Message 2"]});
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
			var entity = gleam.fromJson(userWithTestJson);
			expect(entity.getFlat()).to.deep.equal({id: 1, name: "Nik", email: "nik@butenko.me"});
		});

		it('should return simple object with stripped nested entities in all Array-typed properties', function () {
			var entity = gleam.fromJson(requireText('./fixtures/user-with-arrays.json'));
			expect(entity.getFlat()).to.deep.equal({id: 1, name: "Nik", email: "nik@butenko.me", tests: [], messages: ["Message 1", "Message 2"]});
		});

	});

	describe('#initial', function () {

		it('should have undefined initial values', function () {
			var entity = gleam.entity('user');
			expect(entity.initial()).to.deep.equal({id: undefined, name: undefined, email: undefined});
		});

		it('should return initial value of entity', function () {
			var entity = gleam.entity('user', userData);
			expect(entity.initial()).to.deep.equal({id: 1, name: "Nik", email: "nik@butenko.me"});
		});

		it('should not modify initial after setting new values', function () {
			var entity = gleam.entity('user');
			entity.set({id: 1});
			expect(entity.initial().id).to.be.undefined;
		});

	});

	describe('#modified', function () {

		it('should not have modified status', function () {
			var entity = gleam.entity('user');
			expect(entity.modified()).to.deep.equal({id: false, name: false, email: false});
		});

		it('should set modified flag for set values', function () {
			var entity = gleam.entity('user');
			entity.set({id: 1});
			expect(entity.modified().id).to.be.true;
			expect(entity.modified().email).to.be.false;
		});

	});

	describe('#is', function () {
		var entity;

		beforeEach(function () {
			entity = gleam.entity('user');
		});

		it('should match UserEntity to be instance of "user"', function () {
			expect(entity.is('user')).to.be.true;
		});

		it('should not match UserEntity to be instance of "not/user"', function () {
			expect(entity.is('not/user')).to.be.false;
		});

	});

	describe('#toJSON', function () {

		it('should return simple object with namespace', function () {
			var entity = gleam.fromJson(userJson);
			expect(entity.toJSON()).to.deep.equal(userData);
		});

		it('should return simple object with namespaces for nested entity', function () {
			var entity = gleam.fromJson(userWithTestJson);
			expect(entity.toJSON()).to.deep.equal(userWithTestData);
		});

		it('should support JSON.stringify', function () {
			var entity = gleam.fromJson(userJson);
			expect(spaceFix(JSON.stringify(entity))).to.equal(spaceFix(userJson));
		});

		it('should support JSON.stringify for nested entity', function () {
			var entity = gleam.fromJson(userWithTestJson);
			expect(spaceFix(JSON.stringify(entity))).to.equal(spaceFix(userWithTestJson));
		});

		it('should support JSON.stringify for arrays of nested entities', function () {
			var json = requireText('./fixtures/user-with-arrays.json'),
				entity = gleam.fromJson(json);
			expect(spaceFix(JSON.stringify(entity))).to.equal(spaceFix(json));
		});

	});


	describe('#toString', function () {

		it('should return descriptive string', function () {
			var entity = gleam.entity('user');
			expect(entity.toString()).to.equal('[object Gleam:user]');
		});

		it('should support casting to string', function () {
			var entity = gleam.entity('user/test');
			expect(['', entity].join('')).to.equal('[object Gleam:user/test]');
		});

	});


});
