module.exports = function(db, logger, authorizationController, loggedOutController) {

    // GET routes
    const express = require('express');
    const router = express.Router();

    // routes where user must be logged out are protected by loggedOutController
    // routes where user must be logged in are protected by authorizationController

    // default route
    router.get('/', (req, res) => {
        res.render('pages/home', { pageTitle: 'Home', currentPage: 'home' });
    });

    // login
    router.get('/login', loggedOutController, (req, res) => {
        res.render('pages/login', { pageTitle: 'Login', currentPage: 'login' });
    });

    // registration
    router.get('/register', loggedOutController, (req, res) => {
        res.render('pages/register', { pageTitle: 'Registration', currentPage: 'register' });
    });

    // Connections
    router.get('/connections', authorizationController, (req, res) => {
        // authorizationController gatekeeps page to logged in users
        // identify which account types should be displayed
        var displayType = [];
        if (req.user.accountType == 'super') {  displayType = ['organization', 'volunteer']; }
        if (req.user.accountType == 'organization') {  displayType = ['volunteer']; }
        if (req.user.accountType == 'volunteer') {  displayType = ['organization']; }

        // retrieve all desired account types for display
        db.all('SELECT * FROM users WHERE accountType IN (?)', [displayType], function(err, accounts) {
            if (err) {
                logger.error('Error during db query: ',err);
                return res.status(500).send('Error retrieving accounts');
            }
            // Render the "connections" page and pass the accounts data to the template
            res.render('pages/connections', { pageTitle: 'Connections', currentPage: 'connections', user:req.user, accounts: accounts});
        });
    });

    // My account page
    router.get('/account', authorizationController, (req, res) => {
        // authorizationController gatekeeps page to logged in users
        res.render('pages/account', { pageTitle: 'My Account', currentPage: 'account', user:req.user });
    });

    // Messages page
    router.get('/messages', authorizationController, (req, res) => {
        // authorizationController gatekeeps page to logged in users
        res.render('pages/messages', { pageTitle: 'My Messages', currentPage: 'messages', user:req.user });
    });

    // Export the routes
    return router;

};
