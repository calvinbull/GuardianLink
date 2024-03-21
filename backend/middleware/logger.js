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