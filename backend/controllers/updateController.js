// update user's own account information
function updateController(db, logger, bcrypt) {
    return function(req, res) {
        // route control logic here

        const { accountType, name, username, email, password, 
            availability, backgroundCheck, isCurrentlyAvailable, 
            linkedin, concerns, missionStatement } = req.body;
        // pull userID from session
        const userID = req.user.userID;

        db.run(`UPDATE users SET 
                accountType = ?, 
                name = ?, 
                username = ?, 
                email = ?, 
                password = ?, 
                availability = ?, 
                backgroundCheck = ?, 
                isCurrentlyAvailable = ?, 
                linkedin = ?, 
                concerns = ?, 
                missionStatement = ?
                WHERE id = ?`, 
                [accountType, name, username, email, 
                    bcrypt.hashSync(password, Number(process.env.BCRYPT_SALT_ROUNDS)),
                    availability, backgroundCheck, isCurrentlyAvailable, 
                    linkedin, concerns, missionStatement, userID], (err) => {
            if (err) {
                console.error(err.message);
                logger.error('Error updating user account: ', err.message);
            } else {
                logger.info('User account updated successfully');
            }
        });

    }
}

// export controller
module.exports = updateController;