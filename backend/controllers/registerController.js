// register user to database

function registerController(db, logger, bcrypt) {
    return function(req, res) {
        // route control logic here

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
            } else {
                logger.info('User registered successfully');
            }
        });

    }
}

// export controller
module.exports = registerController;