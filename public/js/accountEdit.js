
// function to dynamically generate a user object based on existing fields
function buildAccountUpdate() {
    // Initialize an empty object to store key-value pairs
    var accountUpdate = {};

    // Get all account properties using the class 'form-control'
    var formElements = document.querySelectorAll('.form-control');

    // Loop through each account property
    formElements.forEach(function(property) {
        // Add the id and value to the accountUpdate object
        accountUpdate[property.id] = property.value;
    });

    // testing
    console.log(accountUpdate);

    return accountUpdate;
}


// account edit submission button
document.getElementById('updateAccountInfo').addEventListener('submit', function(event) {
    // Prevent default form submission behavior
    event.preventDefault();

    // generate user account update object
    const accountUpdate = JSON.stringify(buildAccountUpdate());

    fetch('/auth/accountUpdate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: accountUpdate

    }).then(response => {
        // POST login logic returns a redirect request, this code is to follow it
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            console.log('Error updating user information.');
        }

    }).catch(err => {
        console.log('Error updating user information.');
    });

});

// delete account button
document.getElementById('deleteAccount').addEventListener('submit', function(event) {
    // Prevent default form submission behavior
    event.preventDefault();

    // generate user account update object
    const accountUpdate = JSON.stringify(buildAccountUpdate());

    fetch('/auth/accountUpdate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: accountUpdate

    }).then(response => {
        // POST login logic returns a redirect request, this code is to follow it
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            console.log('Error updating user information.');
        }

    }).catch(err => {
        console.log('Error updating user information.');
    });

});