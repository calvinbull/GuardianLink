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
const helmet = require('helmet');
const sslRedirect = require('express-sslify');
const typeahead = require('typeahead-standalone');
require('typeahead-standalone/dist/basic.css');

// import propertLabels for human readability
const propertyLabels = require('../public/js/propertyLabels');

// constants & .env file import
require('dotenv').config();
const HOST = process.env.SERVER_HOST;
const PORT = Number(process.env.SERVER_PORT);
const SERVER_KEY = path.join(__dirname, 'security', 'cert.key');
const SERVER_CERTIFICATE = path.join(__dirname, 'security', 'cert.pem');
const crypto = require('crypto');
const SESSION_KEY = crypto.randomBytes(32).toString('hex');

// initialize database
const db = require('../database/DBConnect');

// app initialization
const app = express();
// enable helmet to improve https header security and help prevent XSS and code injection threats
app.use(helmet());
// permit loading of bootstrap JS files
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://code.jquery.com", "https://cdn.jsdelivr.net"],
        },
    })
);
// configure express-session
app.use(express.json());
app.use(session({
    secret: SESSION_KEY,
    resave: false,
    saveUninitialized: false
}));
// redirect HTTP to HTTPS
app.use(sslRedirect.HTTPS());
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
const { adminController } = require('./controllers/adminController');
const { passwordResetToken } = require('./middleware/passwordResetToken');
const pageRoutes = require('./routes/pageRoutes')(db, logger, authorizationController, loggedOutController, propertyLabels);
const authRoutes = require('./routes/authRoutes')(db, logger, passport, authorizationController, adminController, passwordResetToken);
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
