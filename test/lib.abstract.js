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

		it('should set overridden value using setter _setEmail no matter what is passed, email = always@email.com', function () {
			var entity = gleam.entity('setterGetter', {email: 'nik@butenko.me'});
			expect(entity.email()).to.equal('always@email.com');
		});

		it('should set value in setter _setPassword using the context, password = context.password2', function () {
			var entity = gleam.entity('setterGetter', {password: 'test', password2: 'test2'});
			expect(entity.password()).to.equal('test2');
		});

		it('should set value in setter _setId using self data, id = self.constant() + value', function () {
			var entity = gleam.entity('setterGetter', {id: 1});
			expect(entity.id()).to.equal(43);
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
			expect(entity.get()).to.deep.equal({id: 1, name: "Nik", email: "nik@butenko.me", tests: [
				{id: 2},
				{id: 3}
			], messages: ["Message 1", "Message 2"]});
		});

		it('should return overridden value using getter _getName', function () {
			var entity = gleam.entity('setterGetter');
			entity.name('Me');
			expect(entity.name()).to.equal('Always');
		});

		it('should use self instance to override value using getter _getAddress, address = self.name()', function () {
			var entity = gleam.entity('setterGetter');
			entity.address('Address');
			expect(entity.address()).to.equal('Always');
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


	describe('#getInitial', function () {

		it('should not have any initial properties', function () {
			var entity = gleam.entity('user');
			expect(entity.getInitial()).to.be.empty;
		});

		it('should add default values to initial fields', function () {
			var entity = gleam.entity('user', {id: 1});
			expect(entity.getInitial()).to.have.keys('id');
			expect(entity.getInitial()).to.be.deep.equal({id: 1});
			expect(entity.getInitial().id).to.equal(1);
		});

		it('should not modify initial after setting new values', function () {
			var entity = gleam.entity('user', {name: 'test'});
			entity.set({id: 1, name: 'test2'});
			expect(entity.getInitial()).not.to.have.keys('id');
			expect(entity.getInitial()).to.have.keys('name');
			expect(entity.getInitial().id).to.be.undefined;
			expect(entity.getInitial().name).to.equal('test');
		});
	});


	describe('#getModified', function () {

		it('should not have any modified properties', function () {
			var entity = gleam.entity('user');
			expect(entity.getModified()).to.be.empty;
		});

		it('should add set values to modified fields', function () {
			var entity = gleam.entity('user');
			entity.set({id: 1});
			expect(entity.getModified()).to.have.keys('id');
			expect(entity.getModified()).to.be.deep.equal({id: 1});
			expect(entity.getModified().id).to.equal(1);
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
