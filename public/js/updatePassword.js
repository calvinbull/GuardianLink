// password update submission
document.getElementById('updatePassword').addEventListener('submit', function(event) {
    // Prevent default form submission behavior
    event.preventDefault();

    // Populate form variables
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('confirmPassword').value;

    // cancel form submission if passwords confirmation doesn't match
    if (password !== passwordConfirm) {
        // Display error message
        document.getElementById('passwordError').style.display = 'block';
        // kill password update submission
        return;
    }

    // send post request for password change attempt
    const passwordChangeRequest = JSON.stringify({ password });

    fetch('/auth/updatePassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: passwordChangeRequest

    }).then(response => response.json())
    .then(data => {
        // display the response message
        alert(data.message);
        window.location.href = '/account';

    }).catch(err => {
        console.log('Error submitting reset request.');
    });

});