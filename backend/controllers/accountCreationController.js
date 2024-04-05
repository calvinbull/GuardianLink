// register user to database from Admin's account creation page

function accountCreationController(db, logger, bcrypt) {
    return function(req, res) {
        // route control logic here

        // prevent ceratin attack attempts by not processing incomplete requests
        if (!req.body) {
            return ;
        }

        const { accountType, name, username, email, password, 
            availability, backgroundCheck, isCurrentlyAvailable, 
            linkedin, concerns, missionStatement } = req.body;
            

        db.run(`INSERT INTO users (accountType, name, username, email, password, 
                    availability, backgroundCheck, isCurrentlyAvailable, 
                    linkedin, concerns, missionStatement) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                    [accountType, name, username, email, bcrypt.hashSync(password, Number(process.env.BCRYPT_SALT_ROUNDS)), 
                        availability, backgroundCheck, isCurrentlyAvailable, 
                        linkedin, concerns, missionStatement], (err) => {
            if (err) {
                console.error(err.message);
                logger.error('Error registering user: ', err.message);
                res.status(500).json({ message: 'Error registering user.' })
            } else {
                logger.info('User registered successfully.');
                // redirect to account creation page
                res.status(200).json({ message: 'User registered successfully.' })
            }
        });

    }
}

// export controller
module.exports = accountCreationController;