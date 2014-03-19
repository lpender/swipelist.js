'use strict';
require.config({
	baseUrl: '',
	paths: {
		jquery: 'jquery.min',
		swipelist: 'swipelist',
		swiper : 'idangerous.swiper'
	},
	shim: {
		jquery: {
			exports: '$'
		}
	},
	scriptType: 'text/javascript'
});

require([
	'jquery',
	'swipelist'
], function ($, Swipelist) {
	var a = new  Swipelist();
	a.myMethod('foo');
	a.myPrototype('foo', 'bar');
});
