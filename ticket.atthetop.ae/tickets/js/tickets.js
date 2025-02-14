/*
*   Theme:- Salient-Child
*   
*/

// For The Tower page tabs switching on click.

// Get all sections that have an ID defined

// const sections = document.querySelectorAll(".nav-content");
// document.querySelector(".navigation ul li:first-of-type a").classList.add("active");
// // Add an event listener listening for scroll
// window.addEventListener("scroll", navHighlighter);

// function navHighlighter() {

//   // Get current scroll position
//   let scrollY = window.scrollY;

//   // Now we loop through sections to get height, top and ID values for each
//   sections.forEach(current => {
//     const sectionHeight = current.offsetHeight;
//     const sectionTop = current.offsetTop - 10;
//     sectionId = current.getAttribute("id");

//     /*
//     - If our current scroll position enters the space where current section on screen is, add .active class to corresponding navigation link, else remove it
//     - To know which link needs an active class, we use sectionId variable we are getting while looping through sections as an selector
//     */
//     if (
//       scrollY > sectionTop &&
//       scrollY <= sectionTop + sectionHeight
//     ){
//       document.querySelector(".navigation ul li a[href*=" + sectionId + "]").classList.add("active");
//     } else {
//       document.querySelector(".navigation ul li a[href*=" + sectionId + "]").classList.remove("active");
//     }
//   });
// }

// $(document).ready(function(){
//   // Add smooth scrolling to all links
//   $(".navigation ul li a").on('click', function(event) {

//     // Make sure this.hash has a value before overriding default behavior
//     if (this.hash !== "") {
//       // Prevent default anchor click behavior
//       event.preventDefault();

//       // Store hash
//       var hash = this.hash;

//       // Using jQuery's animate() method to add smooth page scroll
//       // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
//       $('html, body').animate({
//         scrollTop: $(hash).offset().top - 900
//       }, 300, function(){

//         // Add hash (#) to URL when done scrolling (default click behavior)
//         window.location.hash = hash;
//       });
//     } // End if
//   });
// });






const sections = document.querySelectorAll(".nav-content");
document.querySelector(".navigation ul li:first-of-type a").classList.add("active");
// Add an event listener listening for scroll

window.addEventListener("scroll", navHighlighter);
var windowHt = $(window).height();



function navHighlighter() {

  // Get current scroll position
  let scrollY = window.scrollY;

  // Now we loop through sections to get height, top and ID values for each
  sections.forEach(current => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - windowHt / 4;
    sectionId = current.getAttribute("id");

    /*
    - If our current scroll position enters the space where current section on screen is, add .active class to corresponding navigation link, else remove it
    - To know which link needs an active class, we use sectionId variable we are getting while looping through sections as an selector
    */
   
    let winwidth = $(window).width();
    if (winwidth > 980) {
      if (
        scrollY > sectionTop &&
        scrollY <= sectionTop + sectionHeight
      ) {
        document.querySelector(".navigation ul li a[href*=" + sectionId + "]").classList.add("active");
      } else {
        document.querySelector(".navigation ul li a[href*=" + sectionId + "]").classList.remove("active");
      }
    }
  });
}


$('.navigation ul li a[href^="#"]').on('click', function (event) {
  event.preventDefault();
  // $(document).off("scroll");

  // $('.navigation ul li a').removeClass('active');
  // $('a').each(function () {
  //   $(this).removeClass('active');
  // })
  // $(this).addClass('active');
  var target = this.hash,
    menu = target;
  target = $(target);
  $('html, body').stop().animate({
    'scrollTop': target.offset().top - windowHt / 4
  }, 50);
});

// Get the hash parameter from the URL
var hash = window.location.hash;

// Check if a hash parameter exists
if (hash) {
  hash = hash.substring(1);
  var targetElement = $('#' + hash);

  if (targetElement.length) {
    $('html, body').animate({
      scrollTop: targetElement.offset().top- windowHt / 4
    }, 500); // Adjust the duration as needed
  }
  // Now you can use the 'hash' variable for further processing
  console.log('Hash parameter:', hash);
} else {
  console.log('No hash parameter in the URL.');
}