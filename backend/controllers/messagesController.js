// Messages page to view and send messages

function messagesController(db, logger, propertyLabels) {
    return function(req, res) {
        // authorizationController gatekeeps page to logged in users

        // variable to store all unique usernames for drop down selector
        var existingUsers = [];

        // query to find all unique users except the logged in one
        var usersQuery = `SELECT DISTINCT username FROM users WHERE username != ?`;
        db.all(usersQuery, [req.user.username], function(err, uniqueUsers) {
            if (err) {
                logger.error('Error during db query: ',err);
                return res.status(500).send('Error retrieving accounts');
            }

            // add each username to the list
            uniqueUsers.forEach(function(uniqueUser) {
                existingUsers.push(uniqueUser.username);
            })

            // variable to store all accounts that the logged in user has sent messages to / received from
            var existingConversations = [];

            // build sqlite3 query to return a list of userIDs that have interacted with the logged in user
            var sqlQuery = `SELECT userID, MAX(name) as name
            FROM users
            WHERE userID IN (
                SELECT senderID AS userID
                FROM messages
                WHERE receiverID = ?
                UNION
                SELECT receiverID AS userID
                FROM messages
                WHERE senderID = ?
            )
            GROUP BY userID`;

            // retrieve all accounts that have interacted with the user
            db.all(sqlQuery, [req.user.userID, req.user.userID], function(err, accounts) {
                if (err) {
                    logger.error('Error during db query: ',err);
                    return res.status(500).send('Error retrieving accounts');
                }

                // if no existing conversations, skip ahead to go
                // i.e. render the page with an empty conversation list
                if (accounts.length === 0) {

                    return res.render('pages/messages', {
                        pageTitle: 'My Messages',
                        currentPage: 'messages',
                        user: req.user,
                        existingConversations: existingConversations,
                        existingUsers: existingUsers
                    });
                }

                // loops through the accounts, and add account information to the existingConversations list
                accounts.forEach(function(account) {

                    // add object containing each unique userID and name to the existing conversation list
                    // messages object is currently empty, but will be populated with message DB entries in next step
                    existingConversations.push( { userID: account.userID, name: account.name, messages: [] } );
                });



                // populate messages into existing convos
                // iterate through all existing conversations, run a db query for each to find all related messages, add messages to related object
                existingConversations.forEach(function(conversation, index) {
                    // query to find all messages between logged in user and given conversation userID
                    var messageQuery = `SELECT * FROM messages WHERE (senderID = ? AND receiverID = ?) OR (senderID = ? AND receiverID = ?)`;

                    // Execute the query with parameters
                    db.all(messageQuery, [req.user.userID, conversation.userID, conversation.userID, req.user.userID], function(err, messages) {
                        if (err) {
                            logger.error('Error during db query:', err);
                            return res.status(500).send('Error retrieving messages');
                        }

                        // store messages in the existingConversations object
                        existingConversations[index].messages = messages;

                        // Check if this is the last conversation to be processed
                        if (index === existingConversations.length - 1) {
                            // all conversations are processed, proceed to render messages page

                            res.render('pages/messages', {
                                pageTitle: 'My Messages',
                                currentPage: 'messages',
                                user: req.user,
                                existingConversations: existingConversations,
                                existingUsers: existingUsers
                            });
                        }
                    });
                });
            })

        });

    }
}

// export controller
module.exports = messagesController;