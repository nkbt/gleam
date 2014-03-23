"use strict";

var path = require('path');
var requireText = require('./support/require-text');
var expect = require('chai').expect;
var Gleam = require(path.join(__dirname, '..', 'index'));

describe('Gleam#fromJson', function () {
	var gleam, userJson, userListJson;

	before(function () {
		gleam = new Gleam(path.join(__dirname, 'fixtures', 'gleams'));
		userJson = requireText('./fixtures/user.json', 'UTF-8');
		userListJson = requireText('./fixtures/user-list.json', 'UTF-8');
	});

	it('should return UserEntity from user.json', function () {
		var entity = gleam.fromJson(userJson);
		expect(entity).to.be.an('object');
		expect(Gleam.is(entity, 'user')).to.be.true;
		expect(entity.id()).to.equal(1);
	});

	it('should return array of UserEntity from user-list.json', function () {
		var list = gleam.fromJson(userListJson);
		expect(list).to.be.an('array');
		expect(list).to.have.length(2);
		expect(Gleam.is(list[0], 'user')).to.be.true;
		expect(list[0].id()).to.equal(1);
		expect(Gleam.is(list[1], 'user')).to.be.true;
		expect(list[1].id()).to.equal(2);
	});

});
