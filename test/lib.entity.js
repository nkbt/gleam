"use strict";

var path = require('path');
var expect = require('chai').expect;
var gleamFactory = require(path.join(__dirname, '..', 'lib', 'index'));

describe('Gleam#entity', function () {
	var gleam;

	before(function () {
		gleam = gleamFactory(path.join(__dirname, 'fixtures', 'gleams'));
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

	it('should create UserEntity with initial data', function () {
		var entity = gleam.entity('user', {id: 1, name: 'Nik', email: 'nik@butenko.me'});
		expect(entity.id()).to.equal(1);
		expect(entity.name()).to.equal('Nik');
		expect(entity.email()).to.equal('nik@butenko.me');
	});

	it('should throw error in case of incorrect namespace', function () {
		expect(function () {
			return gleam.entity('wrong/user');
		}).to.throw(Error);
	});

});
