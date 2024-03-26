
// wrap all exports in a function in order to use the initial db connection reference
module.exports = function(db, logger, passport) {
    // POST routes
    const express = require('express');
    const router = express.Router();

    // initialize bcrypt for hashing
    const bcrypt = require('bcrypt');
    const saltRounds = 10; // salt rounds used for hashing

    // register user to database
    router.post('/register', (req, res) => {
        const { accountType, name, username, email, password, 
            availability, backgroundCheck, isCurrentlyAvailable, 
            linkedin, concerns, missionStatement } = req.body;

        db.run(`INSERT INTO users (accountType, name, username, email, password, 
                    availability, backgroundCheck, isCurrentlyAvailable, 
                    linkedin, concerns, missionStatement) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                    [accountType, name, username, email, bcrypt.hashSync(password, saltRounds), 
                        availability, backgroundCheck, isCurrentlyAvailable, 
                        linkedin, concerns, missionStatement], (err) => {
            if (err) {
                console.error(err.message);
                logger.error('Error registering user: ', err.message);
            } else {
                logger.info('User registered successfully');
            }
        });
    });

    // login
    router.post('/login', passport.authenticate('local', {
        successRedirect: '/account',
        failureRedirect: '/login',
    }));

    // logout
    router.post('/logout', function(req, res, next) {
        // logout method provided by passport
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    });

    return router;
}
