let winht = $(window).height();
let controller = new ScrollMagic.Controller({ container: window });
let winwidth = $(window).width();

if (winwidth > 1024) {
  var scene = new ScrollMagic.Scene({
    triggerElement: "#trigger1",
    offset: 0,
    duration: winht * 2,
  })
    .setPin(".ins_main_banner_topbar")
    // .addIndicators({ name: "Set Pin" })
    .addTo(controller);

  let firsttime = false;

  const fadeInAnim = function () {
    if (firsttime == false) {
      TweenMax.from(".header", 1.5, {
        y: -200,
        delay: 1.5,
        ease: Expo.easeInOut,
      });
      TweenMax.to(".header", 1.5, {
        visibility: "visible",
        delay: 1.5,
        ease: Expo.easeInOut,
      });
      TweenMax.to(".lg_bgcut", 2.5, {
        scale: 50,
        force3D: false,
        delay: 0.5,
        ease: Expo.easeInOut,
      });
      TweenMax.to(".logo_anim", 2, {
        scale: 7.2,
        force3D: false,
        delay: 0.5,
        ease: Expo.easeInOut,
      });

      TweenMax.to(".line1", 2, {
        ease: Expo.easeInOut,
        y: 0,
        opacity: 1,
        delay: 1,
      });
      TweenMax.to(".line2", 2, {
        ease: Expo.easeInOut,
        y: 0,
        opacity: 1,
        delay: 1.1,
      });
      TweenMax.to(".mouse_line", 1, {
        ease: Expo.easeInOut,
        opacity: 1,
        delay: 1.8,
      });

      TweenMax.to(".lg_bgcut", 2.5, {
        opacity: 0,
        delay: 1,
        ease: Expo.easeInOut,
      });
      TweenMax.to(".logo_anim", 1.5, {
        opacity: 0,
        delay: 0.7,
        ease: Expo.easeInOut,
      });

      setTimeout(() => {
        $("body").removeAttr("id");
        $("body").removeClass("fullpage_height");
        firsttime = true;
      }, 2500);

      if (winwidth < 991) {
        TweenMax.kill();
        TweenMax.invalidate();
      }
    }
  };

  fadeInAnim();

  var tlblur4 = gsap.timeline();
  tlblur4
    .to(".mouse_line", { duration: 0.5, css: { opacity: 0 } })
    .to(
      ".video_head div span",
      { duration: 1, css: { textShadow: "none", color: "#929292" } },
      0
    )
    .to(".hm_line_wrp", { duration: 2, css: { scale: 0.7, y: "-50vh" } }, 0)
    .to(".hm_video_wrapper", { duration: 0.5, css: { opacity: 0 } }, 0)
    .to(".line4", { duration: 1, css: { opacity: 1, scale: 1 } }, 0.2)
    .to(".BK_img_wrapper", { duration: 1, css: { scale: 1, opacity: 1 } }, 0.7);

  var scene = new ScrollMagic.Scene({
    triggerElement: "#trigger1",
    offset: 5,
    duration: winht,
  })
    .setTween(tlblur4)
    // .addIndicators({ name: "Frist Animation" })
    .addTo(controller);

  var tlblur5 = gsap.timeline();
  tlblur5
    .to(".hm_line_wrp", { opacity: 0, duration: 1 }, 0)
    .to(".showcase-main-wrapper", { opacity: 1, duration: 1 }, 0)
    .to(".BK_img_wrapper", { backgroundColor: "transparent", duration: 1 }, 0)
    .to(
      ".BK_img_wrapper img",
      { ease: Sine.easeInOut, scale: 320, force3D: false, duration: 5 },
      0.5
    )
    .to(".showcase-main-wrapper", { pointerEvents: "all", duration: 1 }, 3);

  var scene = new ScrollMagic.Scene({
    triggerElement: "#trigger1",
    offset: winht - winht / 8 + 5,
    duration: winht,
  })

    .setTween(tlblur5)
    // .addIndicators({ name: "Second Animation" })
    .addTo(controller);

  var scene = new ScrollMagic.Scene({
    triggerElement: "#trigger2",
    offset: -winht,
    duration: winht + winht / 2,
  })
    .on("enter", function () {
      TweenMax.to(".fdtxt_1", 0.5, {
        ease: Power4.easeInOut,
        opacity: 1,
        y: 0,
        pointerEvents: "all",
      });
      TweenMax.to(".fdtxt_2, .fdtxt_3, .fdtxt_4", 0.5, {
        ease: Power4.easeInOut,
        opacity: 0,
        y: 50,
        pointerEvents: "none",
      });
    })
    .addTo(controller);
  //.addIndicators({ name: "First Animation" })

  var scene = new ScrollMagic.Scene({
    triggerElement: "#trigger2",
    offset: winht / 2,
    duration: winht,
  })
    .on("enter", function () {
      TweenMax.to(".fdtxt_1", 0.5, {
        ease: Power4.easeInOut,
        opacity: 0,
        y: -20,
        pointerEvents: "none",
      });
      TweenMax.to(".fdtxt_2", 0.5, {
        ease: Power4.easeInOut,
        opacity: 1,
        y: 0,
        pointerEvents: "all",
      });
      TweenMax.to(".fdtxt_3, .fdtxt_4", 0.5, {
        ease: Power4.easeInOut,
        opacity: 0,
        y: 50,
        pointerEvents: "none",
      });
    })
    .addTo(controller);
  //.addIndicators({ name: "Second Animation" })

  var scene = new ScrollMagic.Scene({
    triggerElement: "#trigger2",
    offset: winht + winht / 2,
    duration: winht,
  })
    .on("enter", function () {
      TweenMax.to(".fdtxt_2", 0.5, {
        ease: Power4.easeInOut,
        opacity: 0,
        y: -20,
        pointerEvents: "none",
      });
      TweenMax.to(".fdtxt_3", 0.5, {
        ease: Power4.easeInOut,
        opacity: 1,
        y: 0,
        pointerEvents: "all",
      });
      TweenMax.to(".fdtxt_4", 0.5, {
        ease: Power4.easeInOut,
        opacity: 0,
        y: 50,
        pointerEvents: "none",
      });
    })
    .addTo(controller);
  //.addIndicators({ name: "third Animation" })

  var scene = new ScrollMagic.Scene({
    triggerElement: "#trigger2",
    offset: winht * 2 + winht / 2,
    duration: winht,
  })
    .on("enter", function () {
      TweenMax.to(".fdtxt_3", 0.5, {
        ease: Power4.easeInOut,
        opacity: 0,
        y: -20,
        pointerEvents: "none",
      });
      TweenMax.to(".fdtxt_4", 0.5, {
        ease: Power4.easeInOut,
        opacity: 1,
        y: 0,
        pointerEvents: "all",
      });
    })
    .addTo(controller);
  //.addIndicators({ name: "fourth Animation" })

  var scene = new ScrollMagic.Scene({
    triggerElement: "#trigger2",
    offset: winht * 4 - winht / 2 - 50,
    duration: winht,
  })
    .on("enter", function () {
      TweenMax.to(".foot_ani1", 1.5, {
        ease: Power4.easeInOut,
        opacity: 1,
        y: 0,
        scale: 1,
        visibility: "visible",
      });
      TweenMax.to(".foot_ani2", 1.5, {
        ease: Power4.easeInOut,
        opacity: 1,
        y: 0,
        scale: 1,
        visibility: "visible",
        delay: 0.2,
      });
      TweenMax.to(".foot_ani3", 1.5, {
        ease: Power4.easeInOut,
        opacity: 1,
        y: 0,
        scale: 1,
        visibility: "visible",
        delay: 0.4,
      });
      TweenMax.to(".foot_ani4", 1.5, {
        ease: Power4.easeInOut,
        opacity: 1,
        visibility: "visible",
        delay: 0.5,
      });
      // TweenMax.to(".foot_ani5", 1.5, { ease: Power4.easeInOut, opacity: 1, visibility: "visible", delay: 0.5 })
    })
    .addTo(controller);
  //.addIndicators({ name: "five Animation" })

  const els = document.querySelectorAll(".ukiyo");
  els.forEach((el) => {
    const parallax = new Ukiyo(el);
  });
}

if (winwidth < 1024) {
  setTimeout(() => {
    $(".logo_banner_animation").fadeOut();
    $("header").css("visibility", "visible");
  }, 1000);

  $(document).ready(function () {
    var sync1 = $("#sync1");
    var sync2 = $("#sync2");
    var slidesPerPage = 4; //globaly define number of elements per page
    var syncedSecondary = true;

    sync1
      .owlCarousel({
        items: 1,
        slideSpeed: 2000,
        nav: false,
        autoplay: false,
        dots: false,
        loop: true,
        responsiveRefreshRate: 200,
      })
      .on("changed.owl.carousel", syncPosition);

    sync2
      .on("initialized.owl.carousel", function () {
        sync2.find(".owl-item").eq(0).addClass("current");
      })
      .owlCarousel({
        items: 1,
        dots: true,
        nav: false,
        smartSpeed: 200,
        slideSpeed: 500,
        slideBy: slidesPerPage,
        responsiveRefreshRate: 100,
      })
      .on("changed.owl.carousel", syncPosition2);

    function syncPosition(el) {
      //if you disable loop you have to comment this block
      var count = el.item.count - 1;
      var current = Math.round(el.item.index - el.item.count / 2 - 0.5);

      if (current < 0) {
        current = count;
      }
      if (current > count) {
        current = 0;
      }

      //end block

      sync2
        .find(".owl-item")
        .removeClass("current")
        .eq(current)
        .addClass("current");
      var onscreen = sync2.find(".owl-item.active").length - 1;
      var start = sync2.find(".owl-item.active").first().index();
      var end = sync2.find(".owl-item.active").last().index();

      if (current > end) {
        sync2.data("owl.carousel").to(current, 100, true);
      }
      if (current < start) {
        sync2.data("owl.carousel").to(current - onscreen, 100, true);
      }
    }

    function syncPosition2(el) {
      if (syncedSecondary) {
        var number = el.item.index;
        sync1.data("owl.carousel").to(number, 100, true);
      }
    }

    sync2.on("click", ".owl-item", function (e) {
      e.preventDefault();
      var number = $(this).index();
      sync1.data("owl.carousel").to(number, 300, true);
    });
  });
}

$(window).on("load", function () {
  if ($(this).scrollTop() > winht) {
    setTimeout(function () {
      $(".mouse_line").hide();
    }, 1000);
  }
});

$(window).scroll(function () {
  var scrollTop = $(window).scrollTop();
  if (scrollTop > winht) {
    $(".mouse_line").css("opacity", "0");
  } else {
    $(".mouse_line").css("opacity", "1");
  }
});

//window load
jQuery(window).on("load", function () {  
  setTimeout(function () {
    //Each video
    jQuery("video.lazyVideo").each(function (index, element) {
      var mainVideo = jQuery("video.lazyVideo").data("lazyvsrc");
      if (mainVideo != "") {
        jQuery("video.lazyVideo").find("source").attr("src", mainVideo);
        jQuery("video.lazyVideo")[0].load();
        jQuery("video.lazyVideo")[0].play();
      }
    });
  }, 4000);
});
