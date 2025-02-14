

// $(document).ready(function () {
//     TweenLite.from(".header", 1.2, { y: -80, delay: 0.5, ease: Expo.easeInOut });
//     TweenLite.to(".header", 1.2, { visibility: "visible", delay: 0.5, ease: Expo.easeInOut });
// });

$(document).ready(function () {
    $('body').addClass('experiences-on-load');
    // disableFullPageScroll();

    setTimeout(function () {
        $('body').removeClass('experiences-on-load');
        // enableFullPageScroll();
    }, 100);


    var isMobile = window.innerWidth < 1024; // Set a breakpoint for mobile devices
    if (isMobile) {
        // Destroy the FullPage.js instance if it exists
        if (typeof fullpage_api !== 'undefined') {
            fullpage_api.destroy('all');
        }
    } else {
        $('#experiences').fullpage({
            scrollOverflow: true,
            fitToSection: true,
            lockAnchors: true,
            scrollingSpeed: 1000,
            fitToSectionDelay: 2000,
            credits: false,
            licenseKey: 'MO816-R5XI9-K776H-58J78-XGKKQ',
            afterLoad: function (origin, destination, direction) {
                // if(direction == "down"){
                //    $("body").removeClass('experiences-on-load');
                // }
            },
            // onLeave: function (origin, destination, direction) {

            // },
            onLeave: function (index, nextIndex, direction) {
                if (direction == "up") {
                    $('.page-template').addClass("back");
                } else {
                    $('.page-template').removeClass("back");
                }
            },
        });
        $('.fp-watermark').remove();
    }
});



$(document).ready(function () {
    var controller = new ScrollMagic.Controller();

    var scene = new ScrollMagic.Scene({
        triggerElement: '.experience',
        triggerHook: .3
    })
        .setClassToggle('.fp-scroll-mac', 'animate_txt')
        // .addIndicators({name: "scroll animate" })
        .addTo(controller);
});


//function for remove class in page

// function removeClassdDuration(){
//     $('body').removeClass('experiences-on-load');
// }


// function disableFullPageScroll() {
//     // fullpage_api.setAllowScrolling
//     fullpage_api.setAllowScrolling(false);
//     fullpage_api.setAllowScrolling(false);
//     // document.body.style.overflow = 'hidden';
//   }

//   function enableFullPageScroll() {
//     // console.log('enable scroll');
//     fullpage_api.setAllowScrolling(true);
//     fullpage_api.setAllowScrolling(true);
//     // document.body.style.overflow = 'auto';
//   }