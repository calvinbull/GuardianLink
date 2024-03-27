
// wrap all exports in a function in order to use the initial db connection reference
module.exports = function(db, logger, passport, authorizationController, adminController, passwordResetToken) {
    // POST routes
    const express = require('express');
    const router = express.Router();

    // initialize bcrypt for hashing
    const bcrypt = require('bcrypt');
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS); // salt rounds used for hashing

    // initialize a Nodemailer transporter for sending password reset links

    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_ACCOUNT,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

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

    // forgotten password initial request
    router.post('/forgotPassword', (req, res) => {
        // pull account info from request
        const { username, email } = req.body;

        // check if unique username / email pair exist
        db.get('SELECT email FROM users WHERE username = ?', [username], (err, dbEmail) => {
            if (err) {
                console.error(err.message);
                logger.error('Error validating password reset request: ', err.message);
            } else {
                if (dbEmail.email == email) {
                    // request is valid
                    logger.info('Valid password reset initiated.');

                    // generate reset email
                    // generate a password reset token for email
                    const resetToken = passwordResetToken(username);
                    // generate expiry time, 10 minutes from now (miliseconds)
                    const tokenExpiry = Date.now() + (10 * 60 * 1000);

                    // add valid token to password_reset_tokens database for later confirmation
                    db.run('INSERT INTO password_reset_tokens (username, token, expiry) VALUES (?, ?, ?)',
                        [username, resetToken, tokenExpiry], (err) => {
                        if (err) {
                            logger.error('Error storing password reset token: ', err);
                            logger.error(username);
                            logger.error(resetToken);
                            logger.error(tokenExpiry);
                            
                        } else {
                            // token stored successfully, proceed with email.
                            // specifiy email options
                            const mailOptions = {
                                from: process.env.EMAIL_ACCOUNT,
                                to: email,
                                subject: `Password Reset Request for ${username}`,
                                text: `Click the following link to reset your password:\nhttp://${process.env.SERVER_HOST}/resetPassword?token=${resetToken}`
                            };

                            // send email via nodemailer
                            transporter.sendMail(mailOptions, (err, info) => {
                                if (err) {
                                    logger.error('Error sending email:', err);
                                    res.status(500).json({ err: 'Error sending email' });
                                } else {
                                    logger.info('Password reset email sent.');
                                    // browser alert of success
                                    res.json({ message: 'Password reset email sent. Please check your email.' });
                                }
                            });
                        }
                    });
                    
                } else {
                    //request is not valid
                    logger.info('Password reset request is unauthorized.');
                    res.json({ message: 'Password reset request is unauthorized.' });
                }
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
