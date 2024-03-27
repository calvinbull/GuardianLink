// password reset submission
document.getElementById('resetPassword').addEventListener('submit', function(event) {
    // Prevent default form submission behavior
    event.preventDefault();

    // Populate form variables
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const password = document.getElementById('password').value;

    // cancel form submission if passwords confirmation doesn't match
    if (document.getElementById('password').value
        !== document.getElementById('confirmPassword').value) {
        // Display error message
        document.getElementById('passwordError').style.display = 'block';
        // kill password update submission
        return;
    }

    // send post request for password change attempt
    const passwordChangeRequest = JSON.stringify({ token, password });

    fetch('/auth/newPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: passwordChangeRequest

    }).then(response => response.json())
    .then(data => {
        // display the response message
        alert(data.message);
    }).catch(err => {
        console.log('Error submitting reset request.');
    });

});