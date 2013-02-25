'use strict';

/**
 * @constructor
 */
var AbstractModel = function () {
	if (!this.__init) {
		this.__init = true;
	}
};

/**
 * @lends AbstractModel
 */
AbstractModel.prototype = {

	/**
	 * @private
	 */
	init: function () {

	},

	/**
	 * @return {AbstractEntity}
	 */
	createEntity: function (data) {
		return require('./entity-factory').get(this.namespace, data);
	}

};

exports.AbstractModel = AbstractModel;