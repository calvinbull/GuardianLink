// imports
const logger = require('../backend/middleware/logger');
const sqlite3 = require('sqlite3');
const path = require('path');
const databasePath = './database/guardian_link.db';

// initialize bcrypt for hashing
const bcrypt = require('bcrypt');
const saltRounds = 10; // salt rounds used for hashing
const defaultPassword = bcrypt.hashSync('changeme', saltRounds);


// Open database, or create new one if doesn't exist
logger.info('Attempting to connect to database.');
const db = new sqlite3.Database(databasePath, (err) => {
    if (err) {
        logger.error('Error opening database: ', err.message);
    } else {
        logger.info('Database successfully opened');
    }}
);

// serialize tasks to prevent execution ordering issues
db.serialize(() => {
    // Check if the database already contains desired tables, create if not
    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, 'users', (err, row) => {
        if (err) {
            logger.error('Error checking table existence: ', err.message);
            return;
        }
        else {
            if (!row) {
                // Users table does not exist
                try {
                    // serialize tasks to prevent execution ordering issues
                    db.serialize(() => {
                        // Create table
                        db.run(`CREATE TABLE IF NOT EXISTS users (
                            userID INTEGER PRIMARY KEY AUTOINCREMENT,
                            accountType TEXT NOT NULL,
                            name TEXT NOT NULL, 
                            username TEXT NOT NULL UNIQUE,
                            email TEXT NOT NULL, 
                            password TEXT NOT NULL,
                            availability TEXT,
                            backgroundCheck TEXT,
                            isCurrentlyAvailable TEXT,
                            linkedin TEXT,
                            concerns TEXT,
                            missionStatement TEXT)`);

                        // Create default credentials for admin role
                        db.run("INSERT INTO users (accountType, name, username, email, password) " + 
                            "VALUES('super','GL_Admin','GL_Admin','admin@guardianlink.com', '" + defaultPassword + "')");
                    });                                            
                    
                    logger.info('users table created successfully.'); 

                } catch (err) {
                    logger.error('Error creating users table: ', err.message);
                }
            }
        }
    });

    // create messages table if doesn't exist
    // timestamp is autogenerated by sqlite
    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, 'messages', (err, row) => {
        if (err) {
            logger.error('Error checking table existence: ', err.message);
            return;
        }
        if (!row) {
            try {
                db.run(`CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    senderID INTEGER NOT NULL,
                    receiverID INTEGER NOT NULL,
                    time TEXT DEFAULT CURRENT_TIMESTAMP,
                    message TEXT NOT NULL,
                    FOREIGN KEY (senderID) REFERENCES users(userID),
                    FOREIGN KEY (receiverID) REFERENCES users(userID))`);
                logger.info('messages table created successfully.'); 
            } catch (err) {
                logger.error('Error creating messages table: ', err.message);
            }
        }
    });
});

// export database connection to app
module.exports = db;