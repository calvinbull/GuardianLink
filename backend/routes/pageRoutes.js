module.exports = function(authorizationController, loggedOutController) {

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
        res.render('pages/connections', { pageTitle: 'Connections', currentPage: 'connections' });
    });
    // My account page
    router.get('/account', authorizationController, (req, res) => {
        // authorizationController gatekeeps page to logged in users
        res.render('pages/account', { pageTitle: 'My Account', currentPage: 'account' });
    });
    // Messages page
    router.get('/messages', authorizationController, (req, res) => {
        // authorizationController gatekeeps page to logged in users
        res.render('pages/messages', { pageTitle: 'My Messages', currentPage: 'messages' });
    });

    // Export the routes
    return router;

};
