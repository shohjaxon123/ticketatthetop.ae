!function (e) { "function" == typeof define && define.amd ? define(e) : e() }(function () { var e, t = ["mousewheel","scroll", "wheel", "touchstart", "touchmove", "touchenter", "touchend", "touchleave", "mouseout", "mouseleave", "mouseup", "mousedown", "mousemove", "mouseenter", "mousewheel", "mouseover"]; if (function () { var e = !1; try { var t = Object.defineProperty({}, "passive", { get: function () { e = !0 } }); window.addEventListener("test", null, t), window.removeEventListener("test", null, t) } catch (e) { } return e }()) { var n = EventTarget.prototype.addEventListener; e = n, EventTarget.prototype.addEventListener = function (n, o, r) { var i, s = "object" == typeof r && null !== r, u = s ? r.capture : r; (r = s ? function (e) { var t = Object.getOwnPropertyDescriptor(e, "passive"); return t && !0 !== t.writable && void 0 === t.set ? Object.assign({}, e) : e }(r) : {}).passive = void 0 !== (i = r.passive) ? i : -1 !== t.indexOf(n) && !0, r.capture = void 0 !== u && u, e.call(this, n, o, r) }, EventTarget.prototype.addEventListener._original = e } });
$(document).ready(function () {
    if($('body').hasClass("rtl")) {
        var rtl = true;
    } else {
        var rtl = false;
    }
    $('#exclusive-carousel').owlCarousel({
        rtl:rtl,
        loop: false,
        margin: 10,
        nav: true,
        navText: ["", "<img src='"+Aurl.theme_url+"/assets/images/carousel_arrow.svg'/>"],
        singleItem: true,
        slideSpeed: 300,
        paginationSpeed: 400,
        rewindSpeed: 500,
        pagination: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        },
        onInitialized: function () {
            var pagination = this.$element.find(".owl-dots");
            var dots = pagination.find(".owl-dot");
            // Hide extra dots
            dots.slice(3).hide();
        }
    });
});
$('#exclusive-carousel .owl-next, #exclusive-carousel .owl-dot:not(.active)').on('click', function () {
    $('#exclusive-carousel .owl-item').siblings().removeClass('anim');
    $('#exclusive-carousel .owl-item.active').addClass('anim');
});
$(document).ready(function (e) {
    var slideIndexS = 0,
        sliding = false;
        var isMobile = window.innerWidth < 1024; // Set a breakpoint for mobile devices
    if (isMobile) {
        // Destroy the FullPage.js instance if it exists
        if (typeof fullpage_api !== 'undefined') {
            fullpage_api.destroy('all');
        }
    } else{
        $('#fullpage').fullpage({
            scrollOverflow: true,
            paddingTop: '0',
            paddingBottom: '0',
            fitToSection: true,
            lockAnchors: true,
            scrollingSpeed: 1500,
            licenseKey: 'MO816-R5XI9-K776H-58J78-XGKKQ',
            afterLoad: function (origin, destination, direction) {
                $('.text-content', destination.item).addClass('animate-text');
                $('.text-content-sub', destination.item).addClass('animate-text-sub');
            },
            afterSlideLoad: function (section, origin, destination, direction) {
                slideIndexS = destination.index + 1;
            },
            onLeave: function (origin, destination, direction) {
                if (origin.index === 1 && !sliding) {
                    if (direction === 'down' && slideIndexS < 3) {
                        $.fn.fullpage.moveSlideRight();
                        $('.level1').removeClass('active-first-lavel');
                        return false;
                    } else if (direction === 'up' && slideIndexS > 1) {
                        $.fn.fullpage.moveSlideLeft();
                        return false;
                    }
                }
                if (direction === 'down' && slideIndexS < 2) {
                    $('.level1').addClass('active-first-lavel');
                }
                if (direction === 'up') {
                    $('.level1').removeClass('active-first-lavel');
                }
                // Check if destination section contains a video element and play it
                if ($(destination.item).find('video').length > 0) {
                    $(destination.item).find('video')[0].play();
                }
                $('.text-content', origin.item).removeClass('animate-text');
                $('.text-content-sub', destination.item).removeClass('animate-text-sub')
            },
        });
    }
    //scroll click for fullpage scroll
    $('#scrollPageOne').on('click', function () {
        $("#fullpage").fullpage.moveTo($(this).index());
    })
});
//window load
jQuery(window).on("load.myCustomNamespace", function(){ 
    setTimeout(function(){
       var mainVideo = jQuery("video#lazyVideo").data("lazyvsrc");
       jQuery("video#lazyVideo source").attr("src", mainVideo);
       jQuery("video#lazyVideo")[0].load();
    }, 1000);
  });