// TODO: 
// alter header to display 'home/login/register' when logged out
// display 'home/connections/messages/my account/logout' when logged in

// enable logout button to send post request
document.getElementById('logout').addEventListener('click', function(event) {
    // prevent the default action
    event.preventDefault(); 

    // sent logout post request
    fetch('/logout', {
        method: 'POST',
    }).then(function() {
        // redirect to home
        window.location.href = '/';
    }).catch(function(error) {
        console.error('Error logging out user: ', error);
    });
});