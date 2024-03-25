module.exports = function(authorizationController) {

    // GET routes
    const express = require('express');
    const router = express.Router();

    // default route
    router.get('/', (req, res) => {
        res.render('pages/home', { pageTitle: 'Home', currentPage: 'home' });
    });
    // login
    router.get('/login', (req, res) => {
        res.render('pages/login', { pageTitle: 'Login', currentPage: 'login' });
    });
    // registration
    router.get('/register', (req, res) => {
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
        res.render('pages/account', { pageTitle: 'My Messages', currentPage: 'messages' });
    });

    // Export the routes
    return router;

};
