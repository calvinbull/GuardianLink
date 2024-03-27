
// wrap all exports in a function in order to use the initial db connection reference
module.exports = function(db, logger, passport, authorizationController, adminController) {
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

    // update user account information
    router.post('/update', authorizationController, (req, res) => {
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
                    bcrypt.hashSync(password, saltRounds),
                    availability, backgroundCheck, isCurrentlyAvailable, 
                    linkedin, concerns, missionStatement, userId], (err) => {
            if (err) {
                console.error(err.message);
                logger.error('Error updating user account: ', err.message);
            } else {
                logger.info('User account updated successfully');
            }
        });
    });


    // delete account from user's own account page
    router.post('/selfDelete', authorizationController, (req, res) => {
        // pull userID from session
        const userID = req.user.userID;

        // Delete user from the database
        db.run(`DELETE FROM users WHERE id = ?`, [userID], (err) => {
            if (err) {
                console.error(err.message);
                logger.error('Error deleting user: ', err.message);
            } else {
                logger.info('User deleted successfully');
            }
        });
    });

    // admin route to delete any given account by userID
    router.post('/adminDelete', adminController, (req, res) => {
        // pull userID from admin's request body
        const userID = req.body.userToDelete;

        // Delete user from the database
        db.run(`DELETE FROM users WHERE id = ?`, [userID], (err) => {
            if (err) {
                console.error(err.message);
                logger.error('Error deleting user: ', err.message);
            } else {
                logger.info('User deleted successfully');
            }
        });
    });

    //password reset
    router.post('/newPassword', (req, res) => {
        // pull userID from session
        const userID = req.user.userID;

    });

    // admin password reset
    router.post('/adminPassword', adminController, (req, res) => {
        // pull userID from admin's request body
        const userID = req.body.userToReset;

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
