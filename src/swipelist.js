(function ($) {
	Swiper.prototype.plugins.swipelist = function(swiper, params) {

		var $PlaylistNotAdded = $(''), // Todo : Add and make configurable
				$PlaylistAdded = $(''),
				$ArrowLeft = $('.swipe-list-left'),
				$ArrowRight = $('.swipe-list-right');

		var options = {
			slideRange : [170,220], // max/min heights
			bSlideGroup : false,  // Whether to slide as a group
			bPaginationGroup : false,
			arrows: true
		};


		/**
		 * Initialize the swipelist functionality
		 */
		function init() {
			console.log('init');

			// Init arrow listeners if there are left/right arrows
			if (options.arrows) {
				initArrowListeners()
			}

			// Check if there are slides
			//checkSlides();

			updateView();

			// attach listeners to update the views
			$(window).on('resize', function () {  // changed back to resize because was getting some issues in slideshowHG sizing down from
				updateView();
			});
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
			if ( options.bPaginationGroup && swiper.params.pagination) {
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
			var nTotalWidth = $(swiper.container).width(),
					newSlideWidth = nTotalWidth;
			console.log('updateView', nTotalWidth);

			while (newSlideWidth > options.slideRange[1]) {
				console.log(newSlideWidth);
				swiper.params.slidesPerView++;
				console.log(swiper.params.slidesPerView);
				newSlideWidth = nTotalWidth/swiper.params.slidesPerView;
			}
			while (newSlideWidth < options.slideRange[0]) {
				console.log(newSlideWidth);
				swiper.params.slidesPerView--;
				console.log(swiper.params.slidesPerView);
				newSlideWidth = nTotalWidth/swiper.params.slidesPerView;
			}

			swiper.params.slidesPerView < 1 ? swiper.params.slidesPerView = 1 : false;

			if (options.bSlideGroup) {
				swiper.params.slidesPerGroup = swiper.params.slidesPerView;
			}
			swiper.params.createPagination = false;

			// Re Init the swiper
			console.log(swiper.params);
			swiper.reInit();
			swiper.swipeTo(getVisibleRange()[0]); // this doesn't actually swipe to the right place... need to swipe to the active page (hmm)
			updatePagination();
			updateArrows(); // Make sure the arrows are enabled/disabled correctly
		}

		/**
		 * Check if slides exist, and hide/show 'no slides' div accordingly
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
			onSwiperCreated : function () {
				init();
				// Have to do this to get the height to calculate correctly (don't know why)
				$(window).resize();
			}
		};
	};
})(window.jQuery);