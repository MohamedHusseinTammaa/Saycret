class AppError extends Error {
    constructor(message, statusCode, statusText, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}

export { AppError };