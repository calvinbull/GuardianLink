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
const logger = winston.createLogger({
    level: 'info', // Set the logging level (e.g., 'info', 'error', 'debug')
    format: winston.format.json(), // Use JSON format for logs
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }), // Log errors to a file
        new winston.transports.File({ filename: 'combined.log' }) // Log all messages to another file
    ]
});
logger.info('Starting new instance of GuardianLink server.');
// export logger
module.exports = logger;

// initialize database
require('../database/DBConnect');


// initialize EJS template engine
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', './backend/views');
// set static asset folder for EJS
app.use(express.static('public'));

// // __dirname workaround for ES module
// import path from 'path';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);








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


// start server
app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`)
} );

// kill server
process.on('SIGINT', () => {
    process.exit(0)
    console.log('Server closed')
});// set static asset folder for EJS
app.use(express.static('public'));