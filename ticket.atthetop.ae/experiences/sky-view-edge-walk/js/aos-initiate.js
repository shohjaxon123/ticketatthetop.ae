$(document).ready(function () {
    AOS.init();
    AOS.init({
        disable: function () {
            var maxWidth = 1101;
            return window.innerWidth < maxWidth;
        }
    });
});


//scroll to ticket section

$(document).on('click', '#view-tickets', function () {

    $('html, body').animate({
        scrollTop: $('#tickets-list').offset().top
    }, 2000); // Adjust the duration (1000ms = 1 second) as needed
})