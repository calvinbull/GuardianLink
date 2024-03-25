// entry point for server
const express = require('express');
const app = express();
app.use(express.json());
const https = require('https');
const fs = require('fs');
const path = require('path');

// initialize bcrypt for hashing
const bcrypt = require('bcrypt');
const saltRounds = 10; // salt rounds used for hashing

// constants
// TODO: replace with env file
const HOST = '127.0.0.1';
const PORT = 3000;
const serverKey = path.join(__dirname, 'security', 'cert.key');
const serverCertificate = path.join(__dirname, 'security', 'cert.pem');

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


// Import routes
const pageRoutes = require('./routes/pageRoutes')();
const authRoutes = require('./routes/authRoutes')(db); // pass db object reference
// Use routes
app.use('/', pageRoutes);
app.use('/auth', authRoutes);


// start server
const serverOptions = { key: fs.readFileSync(serverKey), cert: fs.readFileSync(serverCertificate) };
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
