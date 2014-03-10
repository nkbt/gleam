"use strict";

var path = require('path');
var expect = require('chai').expect;
var Gleam = require(path.join(__dirname, '..', 'index'));

describe('Gleam#entity', function () {
	var gleam, userData;

	before(function () {
		gleam = new Gleam(path.join(__dirname, 'fixtures', 'gleams'));
		userData = require('./fixtures/user.json');
	});

	it('should throw error in case of incorrect namespace', function () {
		function createNotExistingEntity() {
			return gleam.entity('wrongSchema');
		}
		expect(createNotExistingEntity).to.throw(Error);
	});

	it('should throw error in case of wrong Entity schema', function () {
		function createEntityWithWrongSchema() {
			return gleam.entity('wrongSchema');
		}
		expect(createEntityWithWrongSchema).to.throw('Entity must be an object');
	});

	it('should throw error in case of Entity schema has properties and not methods', function () {
		function createEntityWithFaultySchema() {
			return gleam.entity('schemaWithProperties');
		}
		expect(createEntityWithFaultySchema).to.throw('Entity schema must not have any properties');
	});

	it('should create UserEntity', function () {
		var entity = gleam.entity('user');
		expect(entity).to.be.an('object');
		expect(entity).to.have.keys('id', 'name', 'email');
		expect(entity.id).to.be.a('function');
		expect(entity.name).to.be.a('function');
		expect(entity.email).to.be.a('function');
		expect(Gleam.is(entity, 'user')).to.be.true;
	});

	it('should create UserTestEntity', function () {
		var entity = gleam.entity('user/test');
		expect(entity).to.be.an('object');
		expect(entity).to.have.keys('id');
		expect(entity.id).to.be.a('function');
		expect(Gleam.is(entity, 'user/test')).to.be.true;
	});

	it('should create UserEntity with defaults', function () {
		var entity = gleam.entity('user', userData);
		expect(entity.id()).to.equal(userData.id);
		expect(entity.name()).to.equal(userData.name);
		expect(entity.email()).to.equal(userData.email);
	});

	it('should throw Error if wrong defaults passed', function () {
		function createEntityWithWrongData() {
			return gleam.entity('user', 'not an object');
		}
		expect(createEntityWithWrongData).to.throw('Values must be an object');
	});


	it('should set defaults without setting modified flag', function () {
		var entity = gleam.entity('user', userData);
		expect(entity.modified().id).to.be.false;
		expect(entity.modified().name).to.be.false;
		expect(entity.modified().email).to.be.false;
	});

	it('should fill initial values with defaults', function () {
		var entity = gleam.entity('user', userData);
		expect(entity.initial().id).to.equal(userData.id);
		expect(entity.initial().name).to.equal(userData.name);
		expect(entity.initial().email).to.equal(userData.email);
	});

});
