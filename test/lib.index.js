"use strict";

var path = require('path');
var expect = require('chai').expect;
var Gleam = require(path.join(__dirname, '..', 'index'));

describe('Gleam', function () {
	var root = path.join(__dirname, 'fixtures', 'gleams'),
		gleam;


	before(function () {
		gleam = new Gleam(root);
	});


	it('should throw error if root not set', function () {
		expect(Gleam).to.throw('Root');
	});


	it('should have private _root property', function () {
		expect(gleam).to.have.property('_root', root);
	});


	it('should response to [entity, fromJson] instance methods', function () {
		expect(Gleam).to.respondTo('entity');
		expect(Gleam).to.respondTo('fromJson');
	});


	it('should response to [is, buildSync] static methods', function () {
		expect(Gleam).itself.to.respondTo('is');
		expect(Gleam).itself.to.respondTo('buildSync');
	});

});
