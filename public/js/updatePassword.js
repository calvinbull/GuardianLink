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



// add event listener function to toggle password fields between 'password' and 'text'
document.getElementById("showPasswordCheckbox").addEventListener("click", showUpdatePassword);

// function to toggle password fields between 'password' and 'text' while updating password
function showUpdatePassword() {
    var pass = document.getElementById("password");
    var confirm = document.getElementById("confirmPassword");
    if (pass.type === "password" && confirm.type === "password") {
        pass.type = "text";
        confirm.type = "text";
    } else {
        pass.type = "password";
        confirm.type = "password";
    }
}