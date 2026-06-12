class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Flags this as an expected app error
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApiError;