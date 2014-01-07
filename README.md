SwipeList
=========

Responsive swiper plugin, works with iDangerous Swiper (nolimits4web/swiper) to allow a swipeable list of thumbnails to control a swiper.

Notes : the swiper will auto adjust the number of slides: however use "oConfig.oSwiperOptions.slidesPerView" to control the number of slides in the view AT TIME OF PAGE LOAD.  

If you use a client-side image loader, you may want to use a high number (the most it could possibly show), so that you aren't loading huge images unnecessarily.

Usage :

HTML:
<div class="swipe-list-container">
    <div class="icon-arrow-left">
    <div class="swiper-container">
        <div class="swiper-wrapper"?
           <div class="swiper-slide">
           </div>
        </div>
    </div>
    <div class="icon-arrow-right">
</div>

CSS:
include links to css/components/idangerous-swiper-2.css

JS:
dependencies:
/js/components/jQuery/idangerous/swiper-2-2.js

init:

var mySwipeList = new SwipeList('.swipe-list-container', options);

options:

sSwiperContainer: string|node selector for swiper-container (
sArrowRight : string|node selector for arrow right
sArrowLeft : string|node selector for arrow left
arrows : boolean true or false / if false, ignore arrows (use this to set your own arrow behavior... i.e 1 at a time)
slideRange : array|number min/max allowed slidewidth (will adjust # of slides per group based on desired width)
paddingBottom : number padding to add to bottom
bSlideGroup : whether to group slides firmly to pages.  I.e. if 8 slides, only allow viewing 1-4 and 5-8,
bPaginationGroup : same as with slideGroup, limits the pagination dots to the slidegroup pages.
oSwiperOptions : Swiper Options (see http://www.idangero.us/sliders/swiper/api.php)

public methods :

getVisibleRange(optional swiper ) : return array, the visible range of slides
