// admin route to promote a user account to an admin by userID

function adminPromoteController(db, logger) {
    return function(req, res) {
        // route control logic here

        // prevent ceratin attack attempts by not processing incomplete requests
        if (!req.body) {
            return ;
        }

        // pull userID from admin's request body
        const userID = req.body.userToPromote;

        // update userType to 'super'
        db.run(`UPDATE users SET accountType = ? WHERE userID = ?`, ['super', userID], (err) => {
            if (err) {
                console.error(err.message);
                logger.error('Error promoting user: ', err.message);
                // send error response
                res.status(500).json({message: 'Error promoting user'});
            } else {
                logger.info('User promoted successfully');
                // send 'ok' response
                res.status(200).json({ message: 'User promoted successfully.' });
            }
        });
    }
}

// export controller
module.exports = adminPromoteController;