// entry point for server
const express = require('express');
const app = express();
app.use(express.json());
const https = require('https');
const fs = require('fs');


// initialize bcrypt for hashing
const bcrypt = require('bcrypt');
const saltRounds = 10; // salt rounds used for hashing

// constants
// TODO: replace with env file
const HOST = '127.0.0.1';
const PORT = 3000;
const serverKey = './middleware/server.key';
const serverCertificate = './middleware/server.cert';

//imports
const logger = require('./middleware/logger');


// initialize database
const db = require('../database/DBConnect');

// initialize EJS template engine
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', './backend/views');
// set static asset folder for EJS
app.use(express.static('public'));



// route definitions
// GET routes
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

// POST routes
// register user to database
app.post('/register', (req, res) => {
    const { accountType, name, username, email, password, 
        availability, backgroundCheck, isCurrentlyAvailable, 
        linkedin, concerns, missionStatement } = req.body;
    console.log(req.body);

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


// start server
const serverOptions = { key: fs.readFileSync(serverKey), cert: fs.readFileSync(serverCertificate) };
https.createServer(serverOptions, app).listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`)
    logger.info(`Server running at http://${HOST}:${PORT}/`)
} );

// kill server
process.on('SIGINT', () => {
    logger.info('Shutting down server.');

    // close the database
    db.close((err) => {
        if (err) {
            logger.error('Error closing database connection:', err.message);
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
