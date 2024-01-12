const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.File({
            filename: 'logs/combined.log'
        })
    ],
    format: winston.format.combine(winston.format.timestamp(), winston.format.printf((info) => `[${info.timestamp.toString()}] ${info.message.toString()}`))
})

module.exports = logger;