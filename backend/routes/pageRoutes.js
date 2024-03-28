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
    const connectionsController = require('../controllers/connectionsController') (db, logger, propertyLabels);
    router.get('/connections', authorizationController, connectionsController);

    // My account page
    router.get('/account', authorizationController, (req, res) => {
        // authorizationController gatekeeps page to logged in users
        res.render('pages/account', { pageTitle: 'My Account', currentPage: 'account', account: req.user, propertyLabels: propertyLabels });
    });

    // Edit my account page
    router.get('/accountEdit', authorizationController, (req, res) => {
        // authorizationController gatekeeps page to logged in users
        res.render('pages/accountEdit', { pageTitle: 'Edit Account Information', currentPage: 'accountEdit', account: req.user, propertyLabels: propertyLabels });
    });

    // Messages page
    const messagesController = require('../controllers/messagesController') (db, logger, propertyLabels);
    router.get('/messages', authorizationController, messagesController);
    
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
