// set up logger
const fs = require('fs');
const winston = require('winston');
const { combine, timestamp, json } = winston.format;

// Delete existing log files
try {
    fs.unlinkSync('error.log');
    fs.unlinkSync('combined.log');
} catch (err) {
    // Handle file deletion error if log files don't exist
    console.error('Error deleting log files:', err);
}

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