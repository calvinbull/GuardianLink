// load existing users from res render
var existingUsers = JSON.parse(document.getElementById('existingUsers').value);
// note the existingConversation object is formatted: [{ userID, name, username, messages[] }]
var existingConvs = JSON.parse(document.getElementById('existingConvs').value);

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
        // note the existingConvs format: [{ userID, name, username, messages[] }]

        // get user's name in the first list item
        var firstUser = existingConvs[0].name;
        // update the conversation header
        document.getElementById('conversation-header').innerText = firstUser;

        // get username from first list item
        var firstUsername = existingConvs[0].username;

        // otherwise use the first username in the conversation list to pre-populate destinationUser field
        document.getElementById('destinationUser').value = firstUsername;


        // check if a 'sendTo' button was pressed on the connections page
        var parameters = new URLSearchParams(window.location.search);
        var sendTo = parameters.get('sendTo');

        if (sendTo) {
            // use that username for the destination field
            document.getElementById('destinationUser').value = sendTo;
        } else {
            // otherwise use the first username in the conversation list to pre-populate destinationUser field
            document.getElementById('destinationUser').value = firstUsername;
        }

        // 'scroll down' messages by default in order to show the latest message
        var scrollableMessages = document.querySelector('.scrollable-messages');
        scrollableMessages.scrollTop = scrollableMessages.scrollHeight;

    } catch (err) {
        try {
                    // check if a 'sendTo' button was pressed on the connections page
        var parameters = new URLSearchParams(window.location.search);
        var sendTo = parameters.get('sendTo');

        if (sendTo) {

            // use that username for the destination field
            document.getElementById('destinationUser').value = sendTo;

        } else {

            // otherwise use the first username in the conversation list to pre-populate destinationUser field
            document.getElementById('destinationUser').value = firstUsername;

        } } catch (err) {
            console.log("Error populating conversation header: ", err );
        }
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

            // get userID
            // element id format: id="list-<%= conversation.userID %>-list"
            var convID = conversation.getAttribute('id').split('-')[1];

            // convert ID to username by matching against existingConvs list
            var convUsername = null;
            existingConvs.forEach(function(conv) {
                if (convID == conv.userID) { convUsername = conv.username; }
            })

            // populate destinationUser field
            document.getElementById('destinationUser').value = convUsername;


            // 'scroll down' messages by default in order to show the latest message
            // delay 'magic number' is required otherwise the scroll action with be attempted before messages are displayed
            setTimeout(function() {
                var scrollableMessages = document.querySelector('.scrollable-messages');
                scrollableMessages.scrollTop = scrollableMessages.scrollHeight;
            }, 180);

        });
    });
});

