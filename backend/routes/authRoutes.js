
// wrap all exports in a function in order to use the initial db connection reference
module.exports = function(db, logger, passport, authorizationController, adminController, passwordResetToken) {
    // POST routes
    const express = require('express');
    const router = express.Router();

    // initialize bcrypt for hashing
    const bcrypt = require('bcrypt');

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
    const registerController = require('../controllers/registerController') (db, logger, bcrypt);
    router.post('/register', registerController);

    // update user's own account information
    const updateController = require('../controllers/updateController') (db, logger);
    router.post('/accountUpdate', authorizationController, updateController);

    // delete account from user's own account page
    const selfDeleteController = require('../controllers/selfDeleteController') (db, logger);
    router.post('/selfDelete', authorizationController, selfDeleteController); 

    // send a new message
    const sendMessageController = require('../controllers/sendMessageController') (db, logger);
    router.post('/sendMessage', authorizationController, sendMessageController); 

    // admin route to delete any given account by userID
    const adminDeleteController = require('../controllers/adminDeleteController') (db, logger);
    router.post('/adminDelete', adminController, adminDeleteController);

    // forgotten password initial request
    const forgotPasswordController = require('../controllers/forgotPasswordController')(db, logger, passwordResetToken, transporter);
    router.post('/forgotPassword', forgotPasswordController);

    // password reset
    const newPasswordController = require('../controllers/newPasswordController');
    router.post('/newPassword', newPasswordController);

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
