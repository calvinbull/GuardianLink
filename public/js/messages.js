// create datalist for selectable usernames

document.addEventListener("DOMContentLoaded", function() {

    // Create a new datalist
    let dataList = document.getElementById('usernames');

    // Append each username to the datalist
    existingUsers.forEach(function(item) {
        let option = document.createElement('option');
        option.value = item;
        dataList.appendChild(option);
    });

});


// message submission
document.getElementById('sendMessage').addEventListener('submit', function(event) {
    // Prevent default form submission behavior
    event.preventDefault();

    // pull data from forms
    var receiverUserName = document.getElementById('destinationUser').value;
    var message = document.getElementById('messageText').value;

    // generate user account update object
    const newMessage = JSON.stringify({receiverUserName, message});

    fetch('/auth/sendMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: newMessage

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