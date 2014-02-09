"use strict";


function entity(root) {
	return function (namespace, data) {
		return null;
	};
}
function is(root) {
	return function (entity, namespace) {
		return null;
	};
}
function fromJson(root) {
	return function (json) {
		return null;
	};
}
function browserJs(root) {
	return function (namespace) {
		return null;
	};
}

function instance(root) {

	return {
		entity: entity(root),
		is: is(root),
		fromJson: fromJson(root),
		browserJs: browserJs(root)
	};
}

module.exports = exports = instance;
