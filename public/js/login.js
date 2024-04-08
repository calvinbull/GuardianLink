// logic while attempting to log in
document.getElementById('login').addEventListener('submit', function(event) {
    // Prevent default form submission behavior
    event.preventDefault();

    // Populate form variables
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // send post request for login attempt
    const loginRequest = JSON.stringify({ username, password });

    fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: loginRequest
    }).then(response => {
        // POST login logic returns a redirect request, this code is to follow it
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            console.log('Error logging in user.');
        }
    }).catch(err => {
        console.log('Error logging in user.');
    });

});


// add event listener function to toggle password fields between 'password' and 'text'
document.getElementById("showPasswordCheckbox").addEventListener("click", showLoginPassword);
function showLoginPassword() {
    var pass = document.getElementById("password");
    if (pass.type === "password") {
        pass.type = "text";
    } else {
        pass.type = "password";
    }
}