function validateEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test($email);
}
$(document).ready(function () {
    var hash = window.location.hash;
    if (!hash) {
        $(this).scrollTop(0);
    }
});
$(document).ready(function () {
    $('#site-loader').remove();
});
// Side Bar Open & Close
$(document).ready(function () {
    $("#menubtn").click(function () {
        $(".asidebar").toggleClass("fullwidth");
        $(".main-section").toggleClass("fullwidth");
    });
});
var navbar = document.querySelector('nav');
var clickCount = 0;
var prevIndex = 0;
// Profile Management Form
$(document).ready(function () {
    //add class to inner ul if li more than 4 columns
    $(".navbar-for-desktop .megamenu").each(function (i, obj) {
        if ($(this).children().length == 4) {
            $(this).addClass('four-col-menu');
            // updateColumns(this);
        }
    });
    //NAV LIST CLASS ADD
    $(".navbar-nav .nav-list").each(function (i, obj) {
        // Find the first anchor tag within the current .megamenu
        var firstAnchor = $(this).find('a:first');
        // Add a class to the first anchor tag
        firstAnchor.addClass('nav-title');
    });
    /*****Nav List JS********** */
    $(".nav-list").hover(function () {
        $(".header").toggleClass("show");
    });
    $(".navbar-for-desktop .megamenu").each(function (i, obj) {
        if ($(this).children().length == 4) {
            $(this).addClass('four-col-menu');
        }
    });
    // gsap animation
    const bannertextAnim = gsap.timeline();
    bannertextAnim
        .to(".header", { y: 0, duration: 1, ease: Expo.easeInOut }, "-=0.1")
        .to(
            ".line1",
            { y: -50, opacity: 1, duration: 1.2, ease: Expo.easeInOut },
            "-=0.8"
        )
        .to(
            ".line2",
            { y: -25, opacity: 1, duration: 1.2, ease: Expo.easeInOut },
            "-=0.9"
        )
        .to(".line3", { opacity: 1, duration: 1, ease: Expo.easeInOut }, "-=0.9");
});
const parallax = document.getElementById("parallax");
const experience_section = document.getElementById("experience_section");
// Parallax Effect for DIV 1
$(document).ready(function () {
    window.addEventListener("scroll", function () {
        let offset = window.pageYOffset;
        if (parallax) {
            parallax.style.backgroundPositionY = offset * 0.7 + "px";
            // DIV 1 background will move slower than other elements on scroll.
        }
    });
});
// first fold animation
$(document).ready(function () {
    TweenLite.from(".header", 1.2, { y: -80, delay: 0.5, ease: Expo.easeInOut });
    TweenLite.to(".header", 1.2, { visibility: "visible", delay: 0.5, ease: Expo.easeInOut });
    const screenWidth = window.innerWidth;
    let animationParams;
    if (screenWidth > 1450) {
        TweenLite.to(".banner-text2", 1.5, { y: -60, opacity: 1, delay: 1.5, ease: "power4.out" });
    } else if (screenWidth <= 1450) {
        TweenLite.to(".banner-text2", 1.5, { y: -30, opacity: 1, delay: 1.5, ease: "power4.out" });
    }
    TweenLite.to(".view_exp_btn", 1.5, { scale: 1, opacity: 1, delay: 1.7, ease: "power4.out" });
    TweenLite.to(".book_tickt_btn", 1.5, { scale: 1, opacity: 1, delay: 1.8, ease: "power4.out" });
    TweenLite.to("#scrollPageOne", 2.5, { opacity: 1, delay: 2.1, ease: "power4.out" });
});
// init controller
var controller = new ScrollMagic.Controller();
let winht = $(window).height()
// build scenes
var revealElements = document.getElementsByClassName("text-animation");
for (var i = 0; i < revealElements.length; i++) {
    new ScrollMagic.Scene({
        triggerElement: revealElements[i],
        offset: winht / 2,
        triggerHook: 0.8,
    })
        .setClassToggle(revealElements[i], "visible")
        // .addIndicators({name: "Scroll-Animation " + (i+1) })
        .addTo(controller);
}
$(document).ready(function () {
    $(".hamburger-icon").click(function () {
        $("body").toggleClass("block-scroll");
        $(".sidenav-overlay").toggleClass("active");
        $(".hamburger-icon").toggleClass("close");
    });
});
//add class to footer menu heading for responsive
$('.footer-menu ul.menu-row .menu-col h4').addClass("responsive-head");
$(".responsive-head").click(function () {
    if ($(this).hasClass("active")) {
        $('.footer-menu ul.menu-row .menu-col h4').removeClass("active");
    } else {
        $('.footer-menu ul.menu-row .menu-col h4').removeClass("active");
        $(this).toggleClass("active");
    }
})
//add class to header menu heading for responsive
$('.collapsable-sidenav .upper-portion .mobile-menu-static .nav-list').each(function () {
    // Check if it has no child ul elements
    if ($(this).children('ul').length === 0) {
        $(this).find('> a').addClass("no-show");
    } else {
        $(this).find('> a').addClass("responsive-head-mobile").append("<span></span>");
    }
});
$(".responsive-head-mobile span").click(function (event) {
    event.preventDefault();

    var anchorElement = $(this).closest('a.nav-title');
    if (anchorElement.hasClass('active')) {
        $('.collapsable-sidenav .upper-portion .mobile-menu-static .nav-title').removeClass("active");
    } else {
        $('.collapsable-sidenav .upper-portion .mobile-menu-static .nav-title').removeClass("active");
        anchorElement.addClass('active');
    }
});
$('.collapsable-sidenav .upper-portion .mobile-menu-static .nav-list .megamenu ul li a').click(function () {
    $('.sidenav-overlay').removeClass('active');
    $('body').removeClass('block-scroll');
    $('.hamburger-icon').removeClass('close');
});
$(document).ready(function() {
    //for group visit gallery
    $(document).on('click', '.open-lightbox-group-visit', function () {
        var id = this.id.substring(4);
        $('#gallery-' + id).trigger('click');
        $('body').addClass('body-scroll-lock');
    });
    $(document).ready(function(){
        $("#lightbox, .lb-close").click(function () {
            $('body').removeClass('body-scroll-lock');
        });
    });
});