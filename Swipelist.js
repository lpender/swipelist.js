/**
 * Responsive swiper for multiple items in a single slide: adjusts # of slides to conform to min/max width specified by "slideRange".
 * @param container String the container that holds the swiper-container, usually called .swipe-list-container
 * @param config Object configurable options for the swipeList
 * 
 * Requires iDangerous Swiper 2.4+
 *
 */

!function ($) {
	"use strict"; // jshint ;_;
	
	var Swipelist = function(container, config) {
	    this.init(container, config);
	};

	Swipelist.prototype = {
	    constructor : Swipelist,
	    oSwiper : null,
	    sContainer : null,
	    sSwiperContianer : null,
	    jElContainer : null,
	    jElArrowLeft : null,
	    jElArrowRight : null,

	    oConfig : {
	        sSwiperContainer : '.swiper-container',
	        sArrowRight : '.icon-arrow-right',
	        sArrowLeft : '.icon-arrow-left',
	        arrows : false, //let arrows move the swiper pointer
	        slideRange : [170,170], //minimum, maximum width of slides, in pixels.  Will go slightly over, if range too narrow
	        paddingBottom : 15,
	        bSlideGroup : false,
	        bPaginationGroup : false,
	        oSwiperOptions : {
	            loop : false,
	            speed: 600,
	            slidesPerView : 4, //on initial page load
	            scrollbar: {
	                container : '.swiper-scrollbar',
	                draggable : true,
	                hide: true,
	                snapOnRelease: true
	            }
	        }
	    },

	    init: function(container, config) {
	        var _this = this;
	        // Combine config
	        jQ.extend(true, this.oConfig, config);

	        // initialize elements
	        _this.sContainer = container;
	        _this.jElContainer = jQ(container);
	        _this.elSwiperContainer = jQ(container).find(_this.oConfig.sSwiperContainer)[0];
	        _this.jElSwiperContainer = jQ(_this.elSwiperContainer);
	        _this.jElArrowLeft = _this.jElContainer.find(_this.oConfig.sArrowLeft);
	        _this.jElArrowRight = _this.jElContainer.find(_this.oConfig.sArrowRight);
	        _this.jElPlaylistNotAdded = _this.jElContainer.find('.playlist-not-added');
	        _this.jElPlaylistAdded = _this.jElContainer.find('.playlist-added');

	        // change event
	        _this.oConfig.oSwiperOptions.onSlideChangeStart = function(swiper) {
	            _this.updatePagination();
	            _this.updateArrows(swiper);
	        };
	        _this.oConfig.oSwiperOptions.onTouchEnd = function(swiper) {
	            _this.updatePagination();
	            _this.updateArrows(swiper);
	        };

	        if (_this.oConfig.bSlideGroup)
	            _this.oConfig.oSwiperOptions.slidesPerGroup = _this.oConfig.oSwiperOptions.slidesPerView;

	        _this.oSwiper = new Swiper(_this.elSwiperContainer, _this.oConfig.oSwiperOptions);

	        _this.updateArrows();

	        if (_this.oConfig.arrows === true) {
	            _this.initArrowListeners();
	        }

	        _this.checkVideos();

	        jQ(window).on('resize', function () {
	            _this.updateView();
	        });

	        ({
	            // this is supposed to prevent dragging and releasing on the same element from firing a click
	            areClose : function(a, b) {
	                return Math.abs(a[0] - b[0]) < 10 && Math.abs(a[1] - b[1]) < 10;
	            },
	            init : function($elements) {
	                $elements.unbind('mousedown').unbind('mouseup');
	                var giraffe = this,
	                    bottledHandlers = [];
	                jQ.each($elements, function(key, element) {
	                    jQ(element).mousedown(function(event) {
	                        if (typeof bottledHandlers[key] == 'undefined') {
	                            bottledHandlers[key] = jQ.extend(true, {}, jQ._data(this, 'events').click);
	                        }
	                        var x = event.pageX,
	                            y = event.pageY,
	                            zebra = this;
	                        var handler = function(){};
	                        if (typeof bottledHandlers == 'object' && typeof bottledHandlers[key] == 'object' && typeof bottledHandlers[key][0] != 'undefined') {
	                            if (typeof bottledHandlers[key][0].handler == 'function') {
	                                handler = bottledHandlers[key][0].handler;
	                            }
	                        }
	                        var rebind = function(event) {
	                            if (event.which == 1 && giraffe.areClose([event.pageX, event.pageY], [x, y])) {
	                                jQ(zebra).bind('click',
	                                    handler
	                                );
	                            } else {
	                                setTimeout(function(){jQ(zebra).bind('click',
	                                    handler
	                                )}, 350);
	                            }
	                            return true;
	                        };
	                        jQ(this).unbind('click');
	                        jQ($elements).unbind('mouseup', rebind);
	                        jQ($elements).one('mouseup', rebind);
	                        return true;
	                    });
	                });
	                return false;
	            }
	        }).init(this.jElSwiperContainer.find('.thumb'));

	        _this.updateView();
	    },

	    initArrowListeners : function () {
	        var _this = this;
	        _this.jElArrowLeft.click(function() {
	            var nActiveSlide = _this.oSwiper.activeLoopIndex,
	                nSwipeTo = 0;
	            if (nActiveSlide > _this.oConfig.oSwiperOptions.slidesPerView) {
	                nSwipeTo = nActiveSlide - _this.oConfig.oSwiperOptions.slidesPerView;
	            }
	//            _this.jElContainer.find('.swiper-scrollbar').css('opacity', 1);
	            return _this.oSwiper.swipeTo(nSwipeTo);
	        });

	        _this.jElArrowRight.click(function() {
	            var nActiveSlide = _this.oSwiper.activeLoopIndex,
	                nSwipeTo = _this.oSwiper.slides.length - _this.oConfig.oSwiperOptions.slidesPerView;
	            if (nActiveSlide < nSwipeTo) {
	                nSwipeTo = nActiveSlide + _this.oConfig.oSwiperOptions.slidesPerView;
	            }
	//            _this.jElContainer.find('.swiper-scrollbar').css('opacity', 1);
	            return _this.oSwiper.swipeTo(nSwipeTo);
	        });
	    },


	    updatePagination : function () {
	        "use strict";
	        var _this = this;
	        if (_this.oConfig.bPaginationGroup && _this.oConfig.oSwiperOptions.pagination) {
	            var arrDots = _this.oSwiper.paginationButtons,
	                nDots = arrDots.length,
	                nDotsPerPage = _this.oSwiper.params.slidesPerGroup,
	                nPages = Math.ceil(nDots/nDotsPerPage);
	            jQ(arrDots).each(function(index,el) {
	                var targetEl = jQ(el);
	                if (index > (nDots - nDotsPerPage)) {
	                    targetEl.addClass('hide');
	                } else if (index%nDotsPerPage == 0) {
	                    targetEl.removeClass('hide');
	                } else if ((index) == (nDots - nDotsPerPage)) {
	                    targetEl.removeClass('hide');
	                } else {
	                    targetEl.addClass('hide');
	                }
	            });
	        }
	    },

	    /**
	     * Sets the correct active state of the arrows.
	     * @param swiper
	     * @return {Boolean}
	     */
	    updateArrows : function (swiper) {
	        "use strict";
	        var _this = this,
	            swiper = swiper ? swiper : _this.oSwiper,
	            range = _this.getVisibleRange(swiper);

	        if (range[1] === swiper.slides.length - 1) {
	            _this.jElArrowRight.addClass('inactive');
	        } else {
	            _this.jElArrowRight.removeClass('inactive');
	        }
	        if (range[0] === 0) {
	            _this.jElArrowLeft.addClass('inactive');
	        } else {
	            _this.jElArrowLeft.removeClass('inactive');
	        }
	        return true;
	    },

	    updateView : function () {
	        var _this = this,
	            nSlideWidth = _this.jElSwiperContainer.width()/_this.oConfig.oSwiperOptions.slidesPerView;

	        while (nSlideWidth < _this.oConfig.slideRange[0]) {
	            _this.oConfig.oSwiperOptions.slidesPerView--;
	            nSlideWidth = _this.jElSwiperContainer.width()/_this.oConfig.oSwiperOptions.slidesPerView;
	        }
	        while (nSlideWidth > _this.oConfig.slideRange[1]) {
	            _this.oConfig.oSwiperOptions.slidesPerView++;
	            nSlideWidth = _this.jElSwiperContainer.width()/_this.oConfig.oSwiperOptions.slidesPerView;
	        }
	//        _this.jElSwiperContainer.height(_this.oConfig.paddingBottom+(_this.jElSwiperContainer.width()/_this.oConfig.oSwiperOptions.slidesPerView)*9/16);
	        if (_this.oConfig.bSlideGroup) {
	            _this.oConfig.oSwiperOptions.slidesPerGroup = _this.oConfig.oSwiperOptions.slidesPerView;
	        }
	        _this.oConfig.oSwiperOptions.createPagination = false;

	        jQ.extend(_this.oSwiper.params, _this.oConfig.oSwiperOptions);

	        // Re Init the swiper
	        _this.oSwiper.reInit(true);
	        var activeIndex = _this.oSwiper.params.loop ? _this.oSwiper.activeLoopIndex : _this.oSwiper.activeIndex;
	        _this.oSwiper.swipeTo(_this.getVisibleRange()[0]); // this doesn't actually swipe to the right place... need to swipe to the active page (hmm)
	        _this.updatePagination();
	        _this.updateArrows(); // Make sure the arrows are enabled/disabled correctly
	//        _this.initArrows();
	//        _this.jElArrowLeft.trigger('click');
	    },

	    checkVideos : function () {
	        var _this = this;
	        if (_this.oSwiper.slides.length === 0) {
	            _this.jElPlaylistNotAdded.show();
	            _this.jElPlaylistAdded.hide();
	        } else {
	            _this.jElPlaylistNotAdded.hide();
	            _this.jElPlaylistAdded.show();
	        }
	    },

	    getVisibleRange : function (swiper) {
	        var _this = this,
	            swiper = swiper ? swiper : _this.oSwiper,
	            nItemsPerView = swiper.params.slidesPerView,
	            nSelectedItem = swiper.activeLoopIndex,
	            nTotalSlides = swiper.slides.length,
	            startRange = 0,
	            endRange = 0;

	        if (nSelectedItem + nItemsPerView > nTotalSlides) {
	            startRange = nTotalSlides = nItemsPerView;
	            endRange = nTotalSlides - 1;
	        }
	        else {
	            startRange = nSelectedItem;
	            endRange = nSelectedItem + nItemsPerView - 1;
	        }

	        return [startRange, endRange];
	    }
	};
}