// entry point for server

// import dependencies
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const https = require('https');
const fs = require('fs');
const path = require('path');
const logger = require('./middleware/logger');

// import propertLabels for human readability
const propertyLabels = require('../public/js/propertyLabels');

// constants
// TODO: replace with env file
const HOST = '127.0.0.1';
const PORT = 3000;
const SERVER_KEY = path.join(__dirname, 'security', 'cert.key');
const SERVER_CERTIFICATE = path.join(__dirname, 'security', 'cert.pem');
const crypto = require('crypto');
const SESSION_KEY = crypto.randomBytes(32).toString('hex');

// initialize database
const db = require('../database/DBConnect');

// app initialization
const app = express();
app.use(express.json());
// configure express-session
app.use(session({
    secret: SESSION_KEY,
    resave: false,
    saveUninitialized: false
}));
// configure passport
require('./middleware/passportConfig')(passport, db);
app.use(passport.initialize());
app.use(passport.session());
// configure res.locals.isAuthenticated so that it can be used by embedded JS page views
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});


// initialize EJS template engine
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', './backend/views');
// set static asset folder for EJS
app.use(express.static('public'));


// Import routes
const { authorizationController } = require('./controllers/authController');
const { loggedOutController } = require('./controllers/loggedOutController');
const pageRoutes = require('./routes/pageRoutes')(db, logger, authorizationController, loggedOutController, propertyLabels);
const authRoutes = require('./routes/authRoutes')(db, logger, passport);
// Use routes
app.use('/', pageRoutes);
app.use('/auth', authRoutes);


// start server
const serverOptions = { key: fs.readFileSync(SERVER_KEY), cert: fs.readFileSync(SERVER_CERTIFICATE) };
https.createServer(serverOptions, app).listen(PORT, HOST, () => {
    console.log(`Server running at https://${HOST}:${PORT}/`)
    logger.info(`Server running at https://${HOST}:${PORT}/`)
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
