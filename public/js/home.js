// scroll down when 'learn more' button is pressed
document.addEventListener("DOMContentLoaded", function() {
    
    var learnMoreButton = document.getElementById('learnMore');
    var aboutDiv = document.getElementById('about');

    // not working as intended
    learnMoreButton.addEventListener('click', function() {
        window.scrollTo({
            top: aboutDiv.offsetTop - (window.innerHeight * .02),
            behavior: 'smooth'
        });
    });

})