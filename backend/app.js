// entry point for server
const express = require('express');
let app = express();


// initialize bcrypt for hashing
const bcrypt = require('bcrypt');
const saltRounds = 10; // salt rounds used for hashing

// constants
// TODO: replace with env file
const HOST = '127.0.0.1';
const PORT = 3000;

// set up logger
const winston = require('winston');
const { combine, timestamp, json } = winston.format;
const logger = winston.createLogger({
    level: 'info',
    format: combine(timestamp(), json()),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }), // Log errors to a file
        new winston.transports.File({ filename: 'combined.log' }) // Log all messages to another file
    ]
});
logger.info('Starting new instance of GuardianLink server.');

// export logger
module.exports = logger;

// initialize database
const db = require('../database/DBConnect');

// initialize EJS template engine
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', './backend/views');
// set static asset folder for EJS
app.use(express.static('public'));




// route definitions

// default route
app.get('/', (req, res) => {
    res.render('pages/home', { pageTitle: 'Home', currentPage: 'home' });
});
// login
app.get('/login', (req, res) => {
    res.render('pages/login', { pageTitle: 'Login', currentPage: 'login' });
});
// registration
app.get('/register', (req, res) => {
    res.render('pages/register', { pageTitle: 'Registration', currentPage: 'register' });
});
// Connections
app.get('/connections', (req, res) => {
    res.render('pages/connections', { pageTitle: 'Connections', currentPage: 'connections' });
});


// start server
app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`)
} );

// kill server
process.on('SIGINT', () => {
    logger.info('Shutting down server.');

    // close the database
    db.close((error) => {
        if (error) {
            logger.error('Error closing database connection:', error.message);
        }
        else {
            logger.info('Database connection closed');
        }
        
        // close the server
        logger.end();
        // exit after winston logger sends 'finish' event
        logger.on('finish', function() {
            process.exit(0);
        });
    })
});
