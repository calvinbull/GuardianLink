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
        console.log(data.message);
        // redirect to login
        window.location.href = '/login';
    }).catch(err => {
        console.log('Error submitting reset request.');
    });

});

// add event listener function to toggle password fields between 'password' and 'text'
document.getElementById("showPasswordCheckbox").addEventListener("click", showPassword);

// function to toggle password fields between 'password' and 'text' while updating password
function showPassword() {
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