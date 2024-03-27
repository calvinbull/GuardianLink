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
