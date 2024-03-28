// update user's own account information
function updateController(db, logger) {
    return function(req, res) {

        // pull all relevant updates from req body, set any non-relevant properties to null
        const { name= null, username= null, email= null,
            availability= null, backgroundCheck= null, isCurrentlyAvailable= null, 
            linkedin= null, concerns= null, missionStatement= null } = req.body;

        // pull userID from session
        const userID = req.user.userID;

        db.run(`UPDATE users SET 
                name = ?, 
                username = ?, 
                email = ?, 
                availability = ?, 
                backgroundCheck = ?, 
                isCurrentlyAvailable = ?, 
                linkedin = ?, 
                concerns = ?, 
                missionStatement = ?
                WHERE userID = ?`, 
                [name, username, email,
                    availability, backgroundCheck, isCurrentlyAvailable, 
                    linkedin, concerns, missionStatement, userID], (err) => {
            if (err) {
                console.error(err.message);
                logger.error('Error updating user account: ', err.message);
            } else {
                logger.info('User account updated successfully');

                // refresh session with new information
                req.user.name = name;
                req.user.username = username;
                req.user.email = email;
                req.user.availability = availability;
                req.user.backgroundCheck = backgroundCheck;
                req.user.isCurrentlyAvailable = isCurrentlyAvailable;
                req.user.linkedin = linkedin;
                req.user.concerns = concerns;
                req.user.missionStatement = missionStatement;
                
                // redirect to account page
                res.redirect('/account');
            }
        });

    }
}

// export controller
module.exports = updateController;