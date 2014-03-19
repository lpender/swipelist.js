/*
 * swipelist.js
 * Description of the module
 * @link https://github.com/lpender/swipelist.js
 * @author lpender
 * @version 0.1.0
 * @license https://github.com/lpender/swipelist.js/blob/master/LICENSE
 * @copyright lpender
 */

'use strict';

/* global define */

define(['swiper'], function () {
	console.log('Module Swipelist loaded');
	/**
	 * My AMD module: Swipelist
	 * @module Swipelist
	 * @namespace Swipelist
	 * @version 0.1.0
	 * @author lpender
	 */

	/**
	 * @constructor
	 * @since 0.1.0
	 */
	var Swipelist = function () {
		this.params = [];

		/**
		 * my method
		 * @method myMethod
		 * @memberof Swipelist
		 * @param {string|Object|number} param
		 * @since 0.1.0
		 * @returns {String} returns params
		 */
		this.myMethod = function (param) {
			console.log('Method: myMethod | ' + param);
			return param;
		};
		return this;
	};

	/**
	 * my prototype
	 * @method myPrototype
	 * @memberof Swipelist
	 * @param {string} name
	 * @param {string} value
	 * @since 0.1.0
	 * @returns {String} returns name | value
	 */
	Swipelist.prototype.myPrototype = function (name, value) {
		console.log('Method: myPrototype');
		return name + ' | ' + value;
	};

	return Swipelist;
});
