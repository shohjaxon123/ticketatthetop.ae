$(document).ready(function () {

    //Initialize AOS
    AOS.init();

    TweenLite.from(".header", 1.2, { y: -80, delay: 0.5, ease: Expo.easeInOut });
    TweenLite.to(".header", 1.2, { visibility: "visible", delay: 0.5, ease: Expo.easeInOut });
});

function validateEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test($email);
}

function launch_toast() {
    var x = document.getElementById("toast")
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 5000);
}

// Side Bar Open & Close
$(document).ready(function () {
    $("#menubtn").click(function () {
        $(".asidebar").toggleClass("fullwidth");
        $(".main-section").toggleClass("fullwidth");
    });
});
var navbar = document.querySelector('nav');


// Contact form Submit
$(document).ready(function () {

    $("#mousedown").click(function (event) {
        $("html, body").animate({ scrollTop: "+=650px" }, 800);
    });

    $(window).scroll(function () {
        if ($(this).scrollTop() >= 5) {
            $('.mouse_line').fadeIn();
        }
    });

    // contact form validation starts
    $('#contact_submit').on("click", function (e) {
        e.preventDefault(); // Prevent default action

        var name = $("#name").val();
        var email = $("#email").val();
        var contact = $("#contact").val();
        var usertype = $("#usertype").val();
        var contact_nonce = $('#contact_nonce').val();

        if (name.length == "") {
            launch_toast();
            $("#toaststatus").text("Error");
            $("#toastmsg").text("Please enter your name");
            return false;
        }
        else if (email.length == "") {
            launch_toast();
            $("#toaststatus").text("Error");
            $("#toastmsg").text("Please enter your Email Address");
            return false;
        }
        else if (!validateEmail(email)) {
            launch_toast();
            $("#toaststatus").text("Error");
            $("#toastmsg").text("Please enter a valid Email Address");
            return false;
        }
        else if (contact.length == "") {
            $('.error').text('');
            $("#contactmsg").text("Please enter your Contact no.");
            $("#contact").focus();
            return false;
        }
        else {
            launch_toast();
            $("#toaststatus").text("Loading...");
            $("#toastmsg").text("Please wait while we are submitting your request");
            $('#contact_submit').prop('disabled', true);
            $('#contact_submit').css('opacity', '0.6');
            //var ajaxscript = { ajax_url : '/test/testwps/wp-admin/admin-ajax.php' };
            //var userdetails = JSON.parse(Get("https://geolocation-db.com/json/geoip.php"));
            jQuery.ajax({
                url: Aurl.ajaxurl,
                data: {
                    action: 'contact_form_action',
                    name: name, email: email, company: company, enquiry: enquiry, nonce: contact_nonce,
                },
                //processData: false,
                method: 'POST', //Post method
                success: function (response) {
                    //console.log(response)
                    console.log(response)
                    //let res = JSON.parse(response);
                    $('#contact_submit').prop('disabled', false);
                    $('#contact_submit').css('opacity', '1');
                },
                error: function (error) {
                    $('#contact_submit').prop('disabled', false);
                    $('#contact_submit').css('opacity', '1');
                },
                complete: function () {
                    $('#contact_submit').prop('disabled', false);
                    $('#contact_submit').css('opacity', '1');
                }
            });
            return true;
        }
    }); // contact Forn validation ends


    // School form validation starts
    $('#school_form_submit').on("click", function (e) {
        e.preventDefault(); // Prevent default action

        var schoolname = $("#schoolname").val();
        var principal_name = $("#principal_name").val();
        var activity_incharge = $("#activity_incharge").val();
        var classname = [];
        $("input:checkbox[name=classname]:checked").each(function () {
            classname.push($(this).val());
        });
        var no_students = $("#no_students").val();
        var phone_no = $("#phone_no").val();
        var email = $("#email").val();
        var receiveupdate = $('input[name="receiveupdate"]:checked').val();
        var visitdate1 = $("#visitdate1").val();
        var visitdate2 = $("#visitdate2").val();
        var incharge_name = $("#incharge_name").val();
        var designation = $("#designation").val();
        var incharge_contact = $("#incharge_contact").val();
        var incharge_email = $("#incharge_email").val();
        var incharge_request = $("#incharge_request").val();
        var school_nonce = $('#school_nonce').val();

        if (schoolname.length == "") {
            launch_toast();
            $("#toaststatus").text("Error");
            $("#toastmsg").text("Please enter your name");
            //$("#schoolname").focus();
            return false;
        }
        else if (principal_name.length == "") {
            launch_toast();
            $("#toaststatus").text("Error");
            $("#toastmsg").text("Please enter Principal name");
            return false;
        }
        else if (activity_incharge.length == "") {
            launch_toast();
            $("#toaststatus").text("Error");
            $("#toastmsg").text("Please enter name of Activity Incharge");
            return false;
        }
        else if (no_students.length == "") {
            launch_toast();
            $("#toaststatus").text("Error");
            $("#toastmsg").text("Please enter no. of Students");
            return false;
        }
        else if (email.length == "") {
            launch_toast();
            $("#toaststatus").text("Error");
            $("#toastmsg").text("Please enter your email address");
            return false;
        } else if (!validateEmail(email)) {
            launch_toast();
            $("#toaststatus").text("Error");
            $("#toastmsg").text("Please enter a valid email address");
            return false;
        }
        else if (phone_no.length == "") {
            launch_toast();
            $("#toaststatus").text("Error");
            $("#toastmsg").text("Please enter your Contact no.");
            return false;
        }
        else {
            launch_toast();
            $("#toaststatus").text("Loading...");
            $("#toastmsg").text("Please wait while we are submitting you data");
            $('#school_form_submit').prop('disabled', true);
            $('#school_form_submit').css('opacity', '0.6');

            var no_students = $("#no_students").val();
            var phone_no = $("#phone_no").val();
            var email = $("#email").val();
            var receiveupdate = $('input[name="receiveupdate"]:checked').val();
            var visitdate1 = $("#visitdate1").val();
            var visitdate2 = $("#visitdate2").val();
            var incharge_name = $("#incharge_name").val();
            var designation = $("#designation").val();
            var incharge_contact = $("#incharge_contact").val();
            var incharge_email = $("#incharge_email").val();
            var incharge_request = $("#incharge_request").val();

            jQuery.ajax({
                url: Aurl.ajaxurl,
                data: {
                    action: 'school_form_action',
                    schoolname: schoolname, phone_no: phone_no, email: email, receiveupdate: receiveupdate, visitdate1: visitdate1, visitdate2: visitdate2, incharge_name: incharge_name, designation: designation, incharge_contact: incharge_contact, incharge_email: incharge_email, incharge_request: incharge_request, nonce: school_nonce,
                },
                //processData: false,
                method: 'POST', //Post method
                success: function (response) {
                    console.log(response)
                    //let res = JSON.parse(response);
                    $('#school_form_submit').prop('disabled', false);
                    $('#school_form_submit').css('opacity', '1');
                },
                error: function (error) {
                    let err = JSON.parse(error);
                    $('#school_form_submit').prop('disabled', false);
                    $('#school_form_submit').css('opacity', '1');
                },
                complete: function () {
                    $('#school_form_submit').prop('disabled', false);
                    $('#school_form_submit').css('opacity', '1');
                }
            });
            return true;
        }
    }); // School form validation ends



    //Profile Management form
    $(".pf_mgmt_form").on("submit", function (e) {
        e.preventDefault(); // Prevent default action

        var data = {
            firstname: $("#fname").val(),
            email: $("#emailadd").val(),
            contact: $("#phoneno").val(),
            residence: $("#only-countries span").text(),
            gender: $("#gender").val(),
            dob: $("#dob").val()
        };

        if (data.firstname.length == "") {
            $('.error').text('');
            $("#namemsg").text("Please enter your first name");
            $("#fname").focus();
            return false;
        }
        else if (data.email.length == "" || !validateEmail(data.email)) {
            $('.error').text('');
            $("#emailmsg").text("Please enter your email address");
            $("#email").focus();
            return false;
        }
        else if (data.contact.length == "") {
            $('.error').text('');
            $("#contactmsg").text("Please enter your Contact no.");
            $("#phoneno").focus();
            return false;
        }
        else if (data.residence.length == "") {
            $('.error').text('');
            $("#residencemsg").text("Please Select your Residence Country");
            $("#only-countries").focus();
            return false;
        }
        else {
            $('.form-loader').css('display', 'block');
            $('#submit_feedback_button').prop('disabled', true);
            $('#submit_feedback_button').css('opacity', '0.6');
            //var userdetails = JSON.parse(Get("https://geolocation-db.com/json/geoip.php"));
            jQuery.ajax({
                url: Aurl.ajaxurl,
                data: {
                    action: 'pf_mgmt_action',
                    data: data
                },
                //processData: false,
                method: 'POST', //Post method
                success: function (response) {
                    // console.log(response)
                    let res = JSON.parse(response);
                    $('.form-loader').css('display', 'none');
                    if (res.status == 200) {
                        $('.form-message').text(res.message);
                        $('.form-message').css('color', 'green');
                        $('#contactformpopup')[0].reset();
                    } else {
                        $('.form-message').text(res.message);
                        $('.form-message').css('color', 'red');
                    }
                    $('#submit_feedback_button').prop('disabled', false);
                    $('#submit_feedback_button').css('opacity', '1');
                },
                error: function (error) {
                    let err = JSON.parse(error);
                    $('.form-loader').css('display', 'none');
                    $('#submit_feedback_button').prop('disabled', false);
                    $('#submit_feedback_button').css('opacity', '1');
                },
                complete: function () {
                    $('.form-loader').css('display', 'none');
                    $('#submit_feedback_button').prop('disabled', false);
                    $('#submit_feedback_button').css('opacity', '1');
                }
            });
            return true;
        }
    });

    // Popup form validation starts
    $('#pf_mgmt_submit').on("click", function () {
        $(".pf_mgmt_form").submit();
    });

});


$(document).ready(function () {
    $(".hamburger-icon").click(function () {
        $("body").toggleClass("block-scroll");
        $(".sidenav-overlay").toggleClass("active");
        $(".hamburger-icon").toggleClass("close");
    });
});

// Contact form Submit
$(document).ready(function () {


    // Popup form validation starts
    $('#group_form_sub').on("click", function (e) {
        e.preventDefault(); // Prevent default action
        var data = {
            fullname: $("#groupname").val(),
            email: $("#groupemail").val(),
            contact: $("#contact_number").val(),
            id: $("#group_id").val(),
            adults: $("#no_adults").val(),
            telephone_no: $("#telephone_no").val(),
            elderly: $("#no_elderly").val(),
            usertype: {
                resident: $("#usertype1").is(':checked'),
                tourist: $("#usertype2").is(':checked')
            },
            assistance: {
                wheelchair: $("#groupcheckbox1").is(':checked'),
                personalAssist: $("#groupcheckbox2").is(':checked'),
                pictureBooth: $("#groupcheckbox3").is(':checked')
            },
            exp: {
                attLounge: $("#experience1").is(':checked'),
                attSky: $("#experience2").is(':checked'),
                attBk: $("#experience3").is(':checked')
            }
        };

        if (data.fullname.length == "") {
            $('.error').text('');
            $("#namemsg").text("Please enter your name");
            $("#name").focus();
            return false;
        }
        else if (data.email.length == "" || !validateEmail(data.email)) {
            $('.error').text('');
            $("#emailmsg").text("Please enter your email address");
            $("#email").focus();
            return false;
        }
        else {
            $('.form-loader').css('display', 'block');
            $('#submit_feedback_button').prop('disabled', true);
            $('#submit_feedback_button').css('opacity', '0.6');
            //var ajaxscript = { ajax_url : '/test/testwps/wp-admin/admin-ajax.php' };
            //var userdetails = JSON.parse(Get("https://geolocation-db.com/json/geoip.php"));
            jQuery.ajax({
                url: Aurl.ajaxurl,
                data: {
                    action: 'gp_form_act',
                    data: data
                },
                //processData: false,
                method: 'POST', //Post method
                success: function (response) {
                    //console.log(response)
                    let res = JSON.parse(response);
                    $('.form-loader').css('display', 'none');
                    if (res.status == 200) {
                        $('.form-message').text(res.message);
                        $('.form-message').css('color', 'green');
                        $('#contactformpopup')[0].reset();
                    } else {
                        $('.form-message').text(res.message);
                        $('.form-message').css('color', 'red');
                    }
                    $('#submit_feedback_button').prop('disabled', false);
                    $('#submit_feedback_button').css('opacity', '1');
                },
                error: function (error) {
                    let err = JSON.parse(error);
                    $('.form-loader').css('display', 'none');
                    $('#submit_feedback_button').prop('disabled', false);
                    $('#submit_feedback_button').css('opacity', '1');
                },
                complete: function () {
                    $('.form-loader').css('display', 'none');
                    $('#submit_feedback_button').prop('disabled', false);
                    $('#submit_feedback_button').css('opacity', '1');
                }
            });
            return true;
        }
    }); // Popup form validation ends

    $('#exclusive-carousel').owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        navText: ["", "<img src='" + Aurl.theme_url + "/assets/images/carousel_arrow.svg'/>"],
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


    $('.jaw-dropping-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        navText: ["<img src='" + Aurl.theme_url + "/assets/images/carousel_arrow.svg'/>",
        "<img src='" + Aurl.theme_url + "/assets/images/carousel_arrow.svg'/>"],
        items: 1, // Number of items visible on the carousel
        slideBy: 1, // Number of items to slide by
        animateOut: 'fadeOut', // Animation for items going out of view
        animateIn: 'fadeIn',
        responsive: {
            0: {
                items: 1,
                slideBy: 1
            },
            600: {
                items: 1,
                slideBy: 1
            },
            1000: {
                items: 1,
                slideBy: 1
            }
        },
        onInitialized: function () {
            var pagination = this.$element.find(".owl-dots");
            var dots = pagination.find(".owl-dot").hide();

            // Hide extra dots
            dots.slice(3).hide();
        }
    });
    

    $('.packages-carousel').owlCarousel({
        loop: true,
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
                items: 1,
            },
            600: {
                items: 2,
            },
            1000: {
                items: 3,
            }
        },
    });

    $('.testimonials-carousel').owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        dots: false,
        singleItem: true,
        slideSpeed: 300,
        paginationSpeed: 400,
        rewindSpeed: 500,
        pagination: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 2,
            },
            1000: {
                items: 2.5,
            }
        },
    });

    // Portfolio section cursor effect
    var $circle = $('.block_bubble');
    function moveCircle(e) {
        TweenLite.to($circle, 0.3, {
            css: {
                left: e.pageX,
                top: e.pageY
            }
        });
    }
    if ($circle.length) {
        $(window).on('mousemove', moveCircle);
    }
    // $(".case_study_panel .common__btn").hover(function () {
    // $('.case_study_panel').toggleClass("cursor-btn");
    // });



});



//add class to inner ul if li more than 4 columns
$(".navbar-for-desktop .megamenu").each(function (i, obj) {
    if ($(this).children().length == 4) {
        $(this).addClass('four-col-menu');
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


//add class to footer menu heading for responsive
// $('.footer-menu #menu-secondary-menu .menu-col h4, .footer-menu #menu-secondary-menu-arabic .menu-col h4').addClass("responsive-head");
// $(".responsive-head").click(function () {
//     if ($(this).hasClass("active")) {
//         $('.footer-menu #menu-secondary-menu .menu-col h4, .footer-menu #menu-secondary-menu-arabic .menu-col h4').removeClass("active");
//     } else {
//         $('.footer-menu #menu-secondary-menu .menu-col h4, .footer-menu #menu-secondary-menu-arabic .menu-col h4').removeClass("active");
//         $(this).toggleClass("active");
//     }
// })
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
})


// /***Data AOS REMOVE***/
function removeAOSAttributesOnMobile() {
    // Define the maximum width for mobile (adjust as needed)
    const mobileMaxWidth = 1024;

    // Check the current screen width
    const screenWidth = window.innerWidth;

    if (screenWidth <= mobileMaxWidth) {
        // Select all elements with data-aos attributes
        const elementsWithDataAOS = document.querySelectorAll('[data-aos]');

        // Loop through the elements and remove the data-aos attributes
        elementsWithDataAOS.forEach(element => {
            element.removeAttribute('data-aos');
            element.removeAttribute('data-aos-delay');
        });
    }
}

// Call the function when the page loads and on window resize
window.addEventListener('load', removeAOSAttributesOnMobile);
window.addEventListener('resize', removeAOSAttributesOnMobile);