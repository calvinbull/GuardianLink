// Messages page to view and send messages

function messagesController(db, logger, propertyLabels) {
    return function(req, res) {
        // authorizationController gatekeeps page to logged in users

        // prevent ceratin attack attempts by not processing incomplete requests
        if (!req.user) {
            return ;
        }

        // variable to store all unique usernames for drop down selector
        var existingUsers = [];

        // retrieve 'sendTo' username if it was passed in via a connection page button
        var sendTo = req.query.sendTo;

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
            var sqlQuery = `SELECT userID, MAX(name) as name, username, MAX(time) AS newest_timestamp
            FROM users LEFT JOIN messages ON userID IN (senderID, receiverID)
            WHERE userID IN (
                SELECT senderID AS userID
                FROM messages
                WHERE receiverID = ?
                UNION
                SELECT receiverID AS userID
                FROM messages
                WHERE senderID = ?
            )
            GROUP BY userID
            ORDER BY newest_timestamp DESC`;

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
                        existingUsers: existingUsers,
                        sendTo: sendTo,
                        accountType: req.user.accountType.trim()
                    });
                }

                // loops through the accounts, and add account information to the existingConversations list
                accounts.forEach(function(account) {

                    // add object containing each unique userID and name to the existing conversation list
                    // messages object is currently empty, but will be populated with message DB entries in next step
                    existingConversations.push( { userID: account.userID, name: account.name, username:account.username, messages: [] } );
                });


                // using promises to prevent async issue where res.render was being called before all messages populated
                var promises = [];

                // populate messages into existing convos
                // iterate through all existing conversations, run a db query for each to find all related messages, add messages to related object
                existingConversations.forEach(function(conversation, index) {
                    // query to find all messages between logged in user and given conversation userID
                    var messageQuery = `SELECT * FROM messages WHERE (senderID = ? AND receiverID = ?) OR (senderID = ? AND receiverID = ?)`;

                    // Execute the query with parameters
                    // now using promise
                    var promise = new Promise((resolve, reject) => {
                        db.all(messageQuery, [req.user.userID, conversation.userID, conversation.userID, req.user.userID], function(err, messages) {
                            if (err) {
                                logger.error('Error during db query:', err);
                                return res.status(500).send('Error retrieving messages');
                            }

                            // store messages in the existingConversations object
                            existingConversations[index].messages = messages;
                            // resolve promise
                            resolve();
                        });
                    })

                    // add each promise to the promises list
                    promises.push(promise);
                });

                // call res.render once all promises are resolved
                Promise.all(promises).then(() => {
                    // all conversations are processed, proceed to render messages page
                    res.render('pages/messages', {
                        pageTitle: 'My Messages',
                        currentPage: 'messages',
                        user: req.user,
                        existingConversations: existingConversations,
                        existingUsers: existingUsers,
                        sendTo: sendTo,
                        accountType: req.user.accountType.trim()
                    });
                }).catch((err) => {
                    logger.error("Error rendering messages page: ", err);
                });

            })

        });

    }
}

// export controller
module.exports = messagesController;