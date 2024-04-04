// forgotten password reset request
document.getElementById('forgottenPassword').addEventListener('submit', function(event) {
    // Prevent default form submission behavior
    event.preventDefault();

    // Populate form variables
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;

    // send post request for password reset attempt
    const resetRequest = JSON.stringify({ username, email });

    fetch('/auth/forgotPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: resetRequest
    }).then(response => response.json())
    .then(data => {
        // display the response message
        alert(data.message);
        // redirect to login
        window.location.href = '/login';
    }).catch(err => {
        console.error('Error sending reset request: ', err);
    });


});