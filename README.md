swipelist.js
==============

About
--------------

URL: [https://github.com/lpender/swipelist.js](https://github.com/lpender/swipelist.js)

Author: [lpender](https://github.com/lpender)

Swipelist is a responsive plugin for the [iDangerous Swiper](https://github.com/nolimits4web/Swiper).

It operates on the principle that, when designing responsively, the number of slides displayed within a swiper should be calculated based on requirements for the minimum/maximum width of the slides.

As such, you configure it, not by setting the number of slides per view, but my setting a range for the desired widths of the slides.

For example, setting slideRange to [120,140], will cause the swiper to add a slide when the width of each slide goes above 140, or to remove a slide, when it goes below 120.

If Swipelist cannot set the slides in that range, it will round up.

Run `grunt serve` to see the example! (/example/index.html)

Usage:

Requires jQuery and iDangerous Swiper.

Inlcude the swipelist.js file afterwards, and initialize swiper with param:

`swipelist:true`

i.e.

```
new Swiper('.swiper-container', {
  swipelist:true
});
```

You can set the min/max slide-width with the slideRange param in swipelist.js.

More coming soon...


Build from source
--------------

In order to build your generated AMD module from its source, you will also need Grunt. To install Grunt globally on the command line (and run the above build task), run:

```
npm install -g grunt-cli
```

Once you have generated your AMD module skeleton, you can build the minified files, the documentation and the example with Grunt:

```
grunt build
```

You can also launch the `grunt serve` task to load the "example" folder in your browser and benefit from livereload of the page in the browser once you edit one of your source file or one of the example files:

```
grunt serve
```

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)


Credits
--------------

swipelist.js was initiated with [generator-amd](https://github.com/T1st3/generator-amd), a [Yeoman](http://yeoman.io) generator that builds an AMD module boilerplate.

This project uses the following as development dependencies:

* [JSHint](http://jshint.com)
* [JSCS](https://npmjs.org/package/jscs)
* [UglifyJS](http://marijn.haverbeke.nl/uglifyjs)
* [JSDoc](http://usejsdoc.org)



License
--------------

[License](https://github.com/lpender/swipelist.js/blob/master/LICENSE)