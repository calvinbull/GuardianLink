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

    // try to auto-populate default conversation header
    try {
        // note the existingConvs format: [{ userID: account.userID, name: account.name, messages: [] }]

        // get user's name in the first list item
        var firstUser = existingConvs[0].name;
        console.log(existingConvs);
        // update the conversation header
        document.getElementById('conversation-header').innerText = firstUser;


    } catch (err) {
        console.log("Error populating conversation header.");
    }

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

// update conversation header block name & 'to' block when selecting a user
document.addEventListener("DOMContentLoaded", function() {
    // fetch list of conversations from dynamic 'list-group'
    var conversations = document.querySelectorAll('.list-group-item');

    // click event listeners to each conversation selection
    conversations.forEach(function(conversation) {
        conversation.addEventListener('click', function(event) {
            // Prevent default link behavior
            event.preventDefault();

            // get user's name
            var userName = conversation.innerText.trim();
            // update the conversation header
            document.getElementById('conversation-header').innerText = userName;


        });
    });
});
