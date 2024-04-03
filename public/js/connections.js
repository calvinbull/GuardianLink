// add functionality to filter displayed accounts
document.addEventListener("DOMContentLoaded", function() {

    searchInput.addEventListener("input", function() {
        
        // get search string, convert to lower for consitency 
        const query = document.getElementById("searchInput").value.trim().toLowerCase();

        // get selected filtering property and add it to 'account-' to match related class
        const filter = ".account-" + document.getElementById("filterSelection").value;

        // select all account cards
        const accountCards = document.querySelectorAll(".account-card");

        accountCards.forEach(function(card) {
            const name = card.querySelector(filter).textContent.toLowerCase();

            if (name.includes(query)) {
                card.style.display = "block"; // Show the card if it matches the query
            } else {
                card.style.display = "none"; // Hide the card if it doesn't match
            }
        });
    });
});


// add event listeners to password reset buttons
document.querySelectorAll('.password-reset-button').forEach(function(button) {
    button.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default behavior of the button
    
        // TODO: Implement password reset function
    });
});

// add event listeners to delete account buttons
document.querySelectorAll('.delete-account-button').forEach(function(button) {
    button.addEventListener('click', function(event) {
        // prevent the default behavior of the button
        event.preventDefault(); 
        
        // Get the username of the account to be deleted from the button's data attribute
        var userToDelete = button.dataset.userid;
        
        // confirm admin wishes to delete this account with a popup
        if (confirm("Are you sure you want to delete this account?")) {
            // admin confirms intent to delete the account

            // Make a POST request to delete the account
            fetch('/auth/adminDelete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userToDelete: userToDelete })
            })
            .then(function(response) {
                // Handle the response accordingly
                if (response.ok) {
                    console.log('Account deleted successfully');
                    // refresh window
                    window.location.href = '/connections';
                } else {
                    console.error('Error deleting account');
                }
            })
            .catch(function(error) {
                console.error('Error during deletion POST request:', error);
            });
        } else {
            // admin chooses not to delete, do nothing
        }
    });
});
