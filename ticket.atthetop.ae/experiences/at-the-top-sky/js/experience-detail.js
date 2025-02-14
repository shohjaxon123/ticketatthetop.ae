$(document).ready(function(){
        if($('body').hasClass("rtl")) {
            var rtl = true;
        } else {
            var rtl = false;
        }
        var celebTestimonialCount = $('.testimonials-celebrity-carousel .owl-slide').length;
        $('.testimonials-celebrity-carousel').owlCarousel({
            rtl:rtl,
            loop: celebTestimonialCount > 2,
            margin: 18,
            nav: true,
            dots: false,
            singleItem: true,
            slideSpeed: 300,
            paginationSpeed: 400,
            rewindSpeed: 500,
            pagination: true,
            responsive: {
                0: {
                    items: 1.2,
                },
                400: {
                    items: 1.5,
                },
                576: {
                    items: 1.8,
                },
                600: {
                    items: 2.2,
                },
                768: {
                    items: 1.5,
                },
                820: {
                    items: 1.9,
                },
                1100: {
                    items: 2.2,
                },
                1200: {
                    items: 2.5,
                }
            },
    });

    var tripAdvisorReviewCount = $('.testimonials-tripadvisor-carousel .owl-slide').length;
    $('.testimonials-tripadvisor-carousel').owlCarousel({
        rtl:rtl,
        loop: tripAdvisorReviewCount > 2,
        margin: 18,
        nav: true,
        dots: false,
        singleItem: true,
        slideSpeed: 300,
        paginationSpeed: 400,
        rewindSpeed: 500,
        pagination: true,
        responsive: {
            0: {
                items: 1.2,
            },
            400: {
                items: 1.5,
            },
            576: {
                items: 1.8,
            },
            600: {
                items: 2.2,
            },
            768: {
                items: 1.5,
            },
            820: {
                items: 1.9,
            },
            1100: {
                items: 2.2,
            },
            1200: {
                items: 2.5,
            }
        },
    });
    var moreAroundBk = $('.more-around-bk-carousel').owlCarousel({
        rtl:rtl,
        loop: false,
        margin: 0,
        nav: true,
        dots: false,
        singleItem: true,
        slideSpeed: 300,
        paginationSpeed: 400,
        // rewindSpeed: 500,
        pagination: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 1,
            },
            1000: {
                items: 1,
            }
        },
    });
    moreAroundBk.on('changed.owl.carousel', function(event) {
        // Your custom function to run when the carousel slide changes due to swipe
        var index = event.item.index;
        prevIndex = prevIndex != 0 ? prevIndex : 0;
        if(prevIndex == 0) {
            $('.map-pointer').removeClass('active');
            $('.map-pointer').eq(index).addClass('active');
        }
        // prevIndex = index;
    });
    
    var otherExperiencesCount = $('.other-experience-carousel .owl-slide').length;
    $('.other-experience-carousel').owlCarousel({
        rtl:rtl,
        loop: otherExperiencesCount > 3,
        margin: 32,
        nav: true,
        dots: false,
        singleItem: true,
        slideSpeed: 300,
        paginationSpeed: 400,
        rewindSpeed: 500,
        pagination: true,
        responsive: {
            0: {
                items: 1.2,
                margin: 16,
                loop: otherExperiencesCount > 1,
            },
            450: {
                items: 1.5,
                margin: 16,
                loop: otherExperiencesCount > 1,
            },
            576: {
                items: 2.2,
                margin: 16
                
            },
            768: {
                items: 2.5,
                margin: 32,
            },
            1025: {
                items: 3,
                margin: 32,
            }
        },
    });

    var totalSlides = $('.testimonials-celebrity-carousel .owl-item').length;
    if(totalSlides < 3) {
        $('.testimonials-celebrity-carousel .owl-nav').addClass('d-none');
        $('.testimonials .left-portion').addClass('pb-none');
    }

    var totalSlidesTrip = $('.testimonials-tripadvisor-carousel .owl-item').length;
    if(totalSlidesTrip < 3) {
        $('.testimonials-tripadvisor-carousel .owl-nav').addClass('d-none');
        $('.testimonials .left-portion').addClass('pb-none');
    }

    var totalSlidesExp = $('.other-experience-carousel .owl-item').length;
    if(totalSlidesExp <=3) {
        $('.other-experience-carousel .owl-nav').addClass('d-none');
    }
    
    
    //stop instagram video in background
    $('.testimonialModal').on('hidden.bs.modal', function () {

        var loader = details.loader;
        $("iframe").each(function() {
            var src= $(this).attr('src');
            $(this).attr('src',loader);
            setTimeout(() => {
                $(this).attr('src',src);
            }, 1000);
        });
        
    });
});

$(document).on('click', '.view-gallery-btn', function (e) {
    $('.gallery-loop').first().trigger('click');
    $('body').addClass('body-scroll-lock');
})

$(document).on('click', '.open-lightbox', function (e) {
    var id = this.id.substring(4);
    $('#gallery-'+id).trigger('click');
    $('body').addClass('body-scroll-lock');
})

$(document).ready(function(){
    $("#openGallery").click(function () {
        $('body').addClass('body-scroll-lock');
        // $('.lightbox').focus();
    });
    
    
    $("#lightbox, .lb-close").click(function () {
        $('body').removeClass('body-scroll-lock');
    });


    const  focusableElements =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const modal = document.querySelector('#lightbox'); // select the modal by it's id

    const firstFocusableElement = modal.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
    const focusableContent = modal.querySelectorAll(focusableElements);
    const lastFocusableElement = focusableContent[focusableContent.length - 1];


    document.addEventListener('keydown', function(e) {
        let isTabPressed = e.key === 'Tab' || e.keyCode === 9;
      
        if (!isTabPressed) {
          return;
        }
      
        if (e.shiftKey) { // if shift key pressed for shift + tab combination
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus(); // add focus for the last focusable element
            e.preventDefault();
          }
        } else { // if tab key is pressed
          if (document.activeElement === lastFocusableElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
            firstFocusableElement.focus(); // add focus for the first focusable element
            e.preventDefault();
          }
        }
      });
      
      firstFocusableElement.focus();
});


var clickCountMan = 0;
  $(document).on('click', '.map-pointer', function() {
    $('.map-pointer').removeClass('active');
    $(this).addClass('active');
    ///here add code to slide owl carousle by index
    var index = $(this).index() - 1;
    $('.more-around-bk-carousel').trigger('to.owl.carousel', [index, 300]);
    clickCountMan = 1;
  })

  
//   $(document).on('click', '.more-around-bk-carousel button', function() {

//     prevIndex = 0;
//     var index = $('.more-around-bk-carousel .owl-item.active').index();
//     var owl = $('.more-around-bk-carousel .owl-item').length;
//     $('.map-pointer').removeClass('active');
//     $('.map-pointer').eq(index).addClass('active');
//     if(owl == parseInt(index) + 1) {
//         if (clickCountMan === 0) {
//             clickCountMan++;
//         } else if (clickCountMan === 1) {
//             $('.more-around-bk-carousel').trigger('to.owl.carousel', [0, 300]);
//             clickCountMan = 0; // Reset click count
//             $('.map-pointer').removeClass('active');
//             $('.map-pointer').eq(0).addClass('active');
//         }        
//     }
//   })

  $(document).ready(function(){
    $(this).scrollTop(0);
  })