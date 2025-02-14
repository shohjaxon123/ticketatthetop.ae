// Store the current page link when an anchor link is clicked
document.addEventListener('click', function(event) {
    var target = event.target;
    if (target.tagName === 'A' && target.getAttribute('href') && !target.getAttribute('href').startsWith('#')) {
        // Anchor tag has a URL and does not start with '#'
        localStorage.setItem('previousPage', window.location.href);
    }
    // localStorage.setItem('previousPage', window.location.href);
});