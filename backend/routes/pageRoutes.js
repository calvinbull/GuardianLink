module.exports = function(db, logger, authorizationController, loggedOutController, propertyLabels) {

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

    // forgot my password page
    router.get('/forgot', loggedOutController, (req, res) => {
        res.render('pages/forgot', { pageTitle: 'Forgot My Password', currentPage: 'forgot' });
    });

    // registration
    router.get('/register', loggedOutController, (req, res) => {
        res.render('pages/register', { pageTitle: 'Registration', currentPage: 'register' });
    });

    // Connections
    router.get('/connections', authorizationController, (req, res) => {
        // authorizationController gatekeeps page to logged in users
        // identify which account types should be displayed
        var accountTypes = [];
        var accountProperties = [];
        if (req.user.accountType == 'super') {  
            accountTypes = ['super','organization', 'volunteer'];
            accountProperties = ['name', 'username', 'email', 'availability', 'backgroundCheck', 'isCurrentlyAvailable', 'linkedin', 'concerns', 'missionStatement']; }
        if (req.user.accountType == 'organization') {  
            accountTypes = ['volunteer']; 
            accountProperties = ['name', 'username', 'email', 'availability', 'backgroundCheck', 'isCurrentlyAvailable', 'linkedin']; }
        if (req.user.accountType == 'volunteer') {  
            accountTypes = ['organization']; 
            accountProperties = ['name', 'username', 'email', 'concerns', 'missionStatement']; }
        
        // dynamically change number of '?'s in sql query to match number of list items
        var accountTypePlaceholders = accountTypes.map(() => '?').join(',');
        var accountPropertiesString = accountProperties.join(',');
        // build sqlite3 query using desired account columns per user type, and add in required number of ? placeholders for type
        var sqlQuery = `SELECT ${accountPropertiesString} FROM users WHERE accountType IN (${accountTypePlaceholders})`;

        // retrieve all desired account types for display
        db.all(sqlQuery, accountTypes, function(err, accounts) {
            if (err) {
                logger.error('Error during db query: ',err);
                return res.status(500).send('Error retrieving accounts');
            }

            // Render the "connections" page and pass the accounts data to the template
            res.render('pages/connections', { pageTitle: 'Connections', currentPage: 'connections', user:req.user, accounts: accounts, propertyLabels: propertyLabels});
        });
    });

    // My account page
    router.get('/account', authorizationController, (req, res) => {
        // authorizationController gatekeeps page to logged in users
        res.render('pages/account', { pageTitle: 'My Account', currentPage: 'account', account: req.user, propertyLabels: propertyLabels });
    });

    // Messages page
    router.get('/messages', authorizationController, (req, res) => {
        // authorizationController gatekeeps page to logged in users
        res.render('pages/messages', { pageTitle: 'My Messages', currentPage: 'messages', user:req.user, propertyLabels: propertyLabels });
    });

    // resetPassword page
    router.get('/resetPassword', (req, res) => {
        // token should be sent in the get request
        res.render('pages/resetPassword', { pageTitle: 'My Messages', currentPage: 'resetPassword', token:req.token });
    });

    // Export the routes
    return router;

};
