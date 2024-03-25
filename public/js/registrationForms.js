
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
document.getElementById('VolunteerRegistration').addEventListener('submit', function(event) {
    // Prevent default form submission behavior
    event.preventDefault();

    // Populate form variables
    const accountType = document.getElementById('accountTypeV').value;
    const name = document.getElementById('nameV').value;
    const username = document.getElementById('usernameV').value;
    const email = document.getElementById('registrationEmailV').value;
    const password = document.getElementById('registrationPasswordV').value;
    console.log('Password1 is: '+password);
    const availability = document.getElementById('availabilityV').value;
    const backgroundCheck = document.getElementById('backgroundCheckV').value;
    const isCurrentlyAvailable = document.getElementById('currentlyAvailableV').value;
    const linkedin = document.getElementById('linkedinV').value;

    // variables specific to orgs
    const concerns = null;
    const missionStatement = null;

    // cancel form submission if passwords confirmation doesn't match
    if (document.getElementById('registrationPasswordV').value
            !== document.getElementById('confirmPasswordV').value) {
        // Display error message
        document.getElementById('passwordErrorV').style.display = 'block';
        // kill form submission
        return;
    }

    // sent post request to add account to db
    const newAccount = JSON.stringify({ accountType, name, username, email, password, 
        availability, backgroundCheck, isCurrentlyAvailable, linkedin, concerns, missionStatement });
    try {
        fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: newAccount
        });
        console.log('New user account registered.');
    } catch (err) {
        console.log('Error registering user during form POST request.');
    }
    
});

document.getElementById('OrganizationRegistration').addEventListener('submit', function(event) {
    // Prevent default form submission behavior
    event.preventDefault();

    // Populate form variables
    const accountType = document.getElementById('accountTypeO').value;
    const name = document.getElementById('nameO').value;
    const username = document.getElementById('usernameO').value;
    const email = document.getElementById('registrationEmailO').value;
    const password = document.getElementById('registrationPasswordO').value;
    const concerns = document.getElementById('concernsO').value;
    const missionStatement = document.getElementById('missionStatementO').value;

    // variables specific to Volunteers
    const availability = null;
    const backgroundCheck = null;
    const isCurrentlyAvailable = null;
    const linkedin = null;

    // cancel form submission if passwords confirmation doesn't match
    if (document.getElementById('registrationPasswordO').value
            !== document.getElementById('confirmPasswordO').value) {
        // Display error message
        document.getElementById('passwordErrorO').style.display = 'block';
        // kill form submission
        return; 
    }

    // sent post request to add account to db
    const newAccount = JSON.stringify({ accountType, name, username, email, password, 
        availability, backgroundCheck, isCurrentlyAvailable, linkedin, concerns, missionStatement });
    try {
        fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: newAccount
        });
        console.log('New user account registered.');
    } catch (err) {
        console.log('Error registering user during form POST request');
    }

});


