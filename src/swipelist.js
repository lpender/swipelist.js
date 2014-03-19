(function ($) {
	Swiper.prototype.plugins.swipelist = function(swiper, params) {

		var $PlaylistNotAdded = $(''), // Todo : Add and make configurable
				$PlaylistAdded = $(''),
				$ArrowLeft = $('.swipe-list-left'),
				$ArrowRight = $('.swipe-list-right');

		var defaults = {
			slideRange : [170,220], // max/min widths
			bSlideGroup : false,  // Whether to slide as a group
			bPaginationGroup : false,
			arrows: true // whether to allow arrow control
		};

		// Set defaults, if not set.
		for (var opt in defaults) {
			if (!swiper.params.swipeListOpts.hasOwnProperty(opt)) {
				swiper.params.swipeListOpts[opt] = defaults[opt];
			}
		}

		// Enforce minimum less than or equal to maximum
		if (swiper.params.swipeListOpts.slideRange[0] > swiper.params.swipeListOpts.slideRange[1]) {
			console.error ( 'Swiper swipelist: minimum must  be less than maximum');
			swiper.params.swipeListOpts.slideRange = defaults['slideRange'];
		}


		/**
		 * Initialize the swipelist functionality
		 */
		function init() {
			console.log('init');

			// Init arrow listeners if there are left/right arrows
			if (swiper.params.swipeListOpts.arrows) {
				initArrowListeners()
			}

			// Check if there are slides
			//checkSlides();

			//updateView();

			// necessary to get the right height
			swiper.reInit();
		}

		/**
		 * Initialize the listeners on the arrows
		 */
		function initArrowListeners () {
			console.log('initArrowListeners');
			$ArrowLeft.click(function() {
				var nActiveSlide = swiper.activeLoopIndex,
					nSwipeTo = 0;
				if (nActiveSlide > swiper.params.slidesPerView) {
					nSwipeTo = nActiveSlide - swiper.params.slidesPerView;
				}
				return swiper.swipeTo(nSwipeTo);
			});

			$ArrowRight.click(function() {
				var nActiveSlide = swiper.activeLoopIndex,
					nSwipeTo = swiper.slides.length - swiper.params.slidesPerView;
				if (nActiveSlide < nSwipeTo) {
					nSwipeTo = nActiveSlide + swiper.params.slidesPerView;
				}
				return swiper.swipeTo(nSwipeTo);
			});
		}

		/**
		 * Sets the correct active state of the arrows.
		 * @param swiper
		 * @return {Boolean}
		 */
		function updateArrows () {
			console.log('updateArrows');
			var range = getVisibleRange();

			if (range[1] === swiper.slides.length - 1) {
				$ArrowRight.addClass('inactive');
			} else {
				$ArrowRight.removeClass('inactive');
			}
			if (range[0] === 0) {
				$ArrowLeft.addClass('inactive');
			} else {
				$ArrowLeft.removeClass('inactive');
			}
			return true;
		}

		/**
		 * Update the pagination
		 */
		function updatePagination () {
			console.log('updatePagination');
			if ( swiper.params.swipeListOpts.bPaginationGroup && swiper.params.pagination) {
				var arrDots = swiper.paginationButtons,
					nDots = arrDots.length,
					nDotsPerPage = swiper.params.slidesPerGroup;
					//nPages = Math.ceil(nDots/nDotsPerPage);
				$(arrDots).each(function(index,el) {
					var targetEl = $(el);
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
		}

		/**
		 * Update the number of slides, upon resizing the image
		 */
		function updateView () {
			console.log('updateView');
			var nTotalWidth = $(swiper.container).width(),
					newSlideWidth = nTotalWidth/swiper.params.slidesPerView;
			console.log('updateView', nTotalWidth);

			while (newSlideWidth > swiper.params.swipeListOpts.slideRange[1]) {
				swiper.params.slidesPerView++;
				newSlideWidth = nTotalWidth/swiper.params.slidesPerView;
			}
			while (newSlideWidth < swiper.params.swipeListOpts.slideRange[0]) {
				swiper.params.slidesPerView--;
				newSlideWidth = nTotalWidth/swiper.params.slidesPerView;
			}

			swiper.params.slidesPerView < 1 ? swiper.params.slidesPerView = 1 : false;

			if (swiper.params.swipeListOpts.bSlideGroup) {
				swiper.params.slidesPerGroup = swiper.params.slidesPerView;
			}
			swiper.params.createPagination = false;

			// Re Init the swiper
			console.log('initting with slidesPerView: ' + swiper.params.slidesPerView);
			swiper.justUpped = true;
			swiper.reInit(true);  // This triggers "firstInit" for some reason???
			swiper.swipeTo(getVisibleRange()[0]); // this doesn't actually swipe to the right place... need to swipe to the active page (hmm)
			updatePagination();  // update the pagination if in 'slidesPerGroup' mode and only want to show the number of groups
			updateArrows(); // Make sure the arrows are enabled/disabled correctly
		}

		/**
		 * Check if slides exist, and hide/show 'no slides' div accordingly (wip)
		 */
		function checkSlides () {
			console.log('checkSlides');
			if (swiper.slides.length === 0) {
				$PlaylistNotAdded.show();
				$PlaylistAdded.hide();
			} else {
				$PlaylistNotAdded.hide();
				$PlaylistAdded.show();
			}
		}

		/**
		 * Required to get the currently visible slides
		 * @returns {number []} [ startIndex, endIndex ]
		 */
		function getVisibleRange () {
			console.log('getVisibleRange');
			var nItemsPerView = swiper.params.slidesPerView,
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

		return {
			onSlideChangeStart : function () {
				updatePagination();
				updateArrows();
			},
			onTouchEnd : function () {
				updatePagination();
				updateArrows();
			},
			onInit: function () {
				if(!swiper.justUpped) {
					updateView();
					swiper.justUpped = false;
				}
				$(window).resize();
			},
			onSwiperCreated : function () {
				init();
			}
		};
	};
})(window.jQuery);