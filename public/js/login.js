// logic while attempting to log in
document.getElementById('login').addEventListener('submit', function(event) {
    // Prevent default form submission behavior
    event.preventDefault();

    // Populate form variables
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // send post request for login attempt
    const loginRequest = JSON.stringify({ username, password });
    try {
        fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: newAccount
        });
        console.log('User logged in.');
    } catch (err) {
        console.log('Error logging in user.');
    }

});
