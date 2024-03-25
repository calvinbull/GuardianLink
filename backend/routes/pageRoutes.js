module.exports = function() {

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
    router.get('/connections', (req, res) => {
        res.render('pages/connections', { pageTitle: 'Connections', currentPage: 'connections' });
    });

    // Export the routes
    return router;

};
