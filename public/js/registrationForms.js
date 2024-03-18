// Add event listeners to registration page radio buttons to toggle form type
document.getElementById('registerOrganization').addEventListener('change', function() {
    document.getElementById('OrganizationRegistration').style.display = 'block';
    document.getElementById('VolunteerRegistration').style.display = 'none';
});
document.getElementById('registerIndividual').addEventListener('change', function() {
    document.getElementById('OrganizationRegistration').style.display = 'none';
    document.getElementById('VolunteerRegistration').style.display = 'block';
});


// Add event listener to the two registration form variants
// NOTE: currently prints all form information to console for debugging!
document.getElementById('VolunteerRegistration').addEventListener('submit', function(event) {
    // Prevent default form submission behavior
    event.preventDefault();

    // Serialize form data (optional)
    const formData = new FormData(this);

    // Log form data to console (optional)
    console.log('Form data:', formData);
});
document.getElementById('OrganizationRegistration').addEventListener('submit', function(event) {
    // Prevent default form submission behavior
    event.preventDefault();

    // Serialize form data (optional)
    const formData = new FormData(this);

    // Log form data to console (optional)
    console.log('Form data:', formData);
});


