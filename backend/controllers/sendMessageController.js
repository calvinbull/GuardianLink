// send a new message

function sendMessageController(db, logger) {
    return function(req, res) {
        // pull required info from request
        var senderID = req.user.userID;
        var message = req.body.message;
        var receiverUserName = req.body.receiverUserName;

        // need to convert receiverUserName to receiverID
        db.get('SELECT userID FROM users WHERE username = ?', [receiverUserName], (err, receiverID) => {
            if (err) {
                console.error(err.message);
                logger.error('Error convertin username to userID: ', err.message);
            } else {
                // if row exists / isn't null
                if (receiverID){

                    // add new message to db
                    db.run(`INSERT INTO messages (senderID, receiverID, message) VALUES (?, ?, ?)`, 
                        [senderID, receiverID.userID, message], (err) => {
                        if (err) {
                            console.error(err.message);
                            logger.error('Error sending message: ', err.message);
                        } else {
                            logger.info('Message sent successfully');
                            logger.info();
                            // redirect to messages page to refresh data
                            res.redirect('/messages');
                        }
                    });
                }              
            }
        });

    }
}

// export controller
module.exports = sendMessageController;