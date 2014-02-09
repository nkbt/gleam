"use strict";

var path = require('path');
var expect = require('chai').expect;
var gleamFactory = require(path.join(__dirname, '..', 'lib', 'index'));

describe('Gleam#entity', function () {
	var gleam, userData;

	before(function () {
		gleam = gleamFactory(path.join(__dirname, 'fixtures', 'gleams'));
		userData = require('./fixtures/user.json');
	});

	it('should create UserEntity', function () {
		var entity = gleam.entity('user');
		expect(entity).to.be.an('object');
		expect(entity).to.have.keys('id', 'name', 'email');
		expect(entity.id).to.be.a('function');
		expect(entity.name).to.be.a('function');
		expect(entity.email).to.be.a('function');
		expect(gleam.is(entity, 'user')).to.be.true;
	});

	it('should create UserTestEntity', function () {
		var entity = gleam.entity('user/test');
		expect(entity).to.be.an('object');
		expect(entity).to.have.keys('id');
		expect(entity.id).to.be.a('function');
		expect(gleam.is(entity, 'user/test')).to.be.true;
	});

	it('should create UserEntity with defaults', function () {
		var entity = gleam.entity('user', userData);
		expect(entity.id()).to.equal(userData.id);
		expect(entity.name()).to.equal(userData.name);
		expect(entity.email()).to.equal(userData.email);
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

	it('should throw error in case of incorrect namespace', function () {
		expect(function () {
			return gleam.entity('wrong/user');
		}).to.throw(Error);
	});

});
