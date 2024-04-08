// function to toggle password fields between 'password' and 'text' during account registration actions
function showPassword() {
    var pass = document.getElementById("registrationPassword");
    var confirm = document.getElementById("confirmPassword");
    if (pass.type === "password" && confirm.type === "password") {
        pass.type = "text";
        confirm.type = "text";
    } else {
        pass.type = "password";
        confirm.type = "password";
    }
}



// initialize variable to store destination div for dynamic forms:
var dynamicFormContainer = document.getElementById('dynamicFormContainer');


// Add event listeners to radio buttons to toggle form type
document.querySelectorAll('input[name="gridRadios"]').forEach(function(radio) {
    radio.addEventListener('change', function(event) {
        // insert the corresponding form based on the selected radio button
        // extract radio button value
        var selection = document.querySelector('input[type=radio][name="gridRadios"]:checked').value;

        // update the dynamicFormContainer with the relevant form using fetch
        fetch(`/html/${selection}RegistrationForm.html`)
            .then(response => response.text())
            .then(html => {
            dynamicFormContainer.innerHTML = html;
            
            // add event listener function to toggle password fields between 'password' and 'text'
            document.getElementById("showPasswordCheckbox").addEventListener("click", showPassword);
        }).catch(err => console.error(err));

    });
});


// Add event listener to dynamically created registration form
document.addEventListener('submit', function(event) {
    // check if the subit event happened within a registrationForm
    if(event.target.id === 'registrationForm') {
        // account registration form was submitted from one of the form types

        // Prevent default form submission behavior
        event.preventDefault();

        // Populate form variables, assign null to any fields without matching IDs (for those specific to account types)
        const accountType = document.getElementById('accountType').value;
        const name = document.getElementById('name').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('registrationEmail').value;
        const password = document.getElementById('registrationPassword').value;
        const availability = document.getElementById('availability') ? document.getElementById('availability').value : null;
        const backgroundCheck = document.getElementById('backgroundCheck') ? document.getElementById('backgroundCheck').value : null;
        const isCurrentlyAvailable = document.getElementById('currentlyAvailable') ? document.getElementById('currentlyAvailable').value : null;
        const linkedin = document.getElementById('linkedin') ? document.getElementById('linkedin').value : null;
        const concerns = document.getElementById('concerns') ? document.getElementById('concerns').value : null;
        const missionStatement = document.getElementById('missionStatement') ? document.getElementById('missionStatement').value : null;

        // cancel form submission if passwords confirmation doesn't match
        if (document.getElementById('registrationPassword').value
                !== document.getElementById('confirmPassword').value) {
            // Display error message
            document.getElementById('passwordError').style.display = 'block';
            // kill form submission
            return;
        }

        // sent post request to add account to db
        const newAccount = JSON.stringify({ accountType, name, username, email, password, 
            availability, backgroundCheck, isCurrentlyAvailable, linkedin, concerns, missionStatement });
        fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: newAccount
        }).then(response => response.json())
        .then(data => {
            // display the response message
            alert(data.message);
            console.log('New user account registered.');
            // redirect to login page
            window.location.href = '/login'
        }).catch(err => {
            console.error('Error during registration: ', err);
        });
    }

});




