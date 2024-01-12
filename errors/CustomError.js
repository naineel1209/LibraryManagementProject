class CustomError extends Error {
    constructor(message, statusMessage, statusCode) {
        super(message);
        this.statusMessage = statusMessage;
        this.statusCode = statusCode;
    }
}

module.exports = CustomError;