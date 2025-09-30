class AppError extends Error {
    statusCode: number;
    statusText: string;
    details: unknown;

    constructor(message: string, statusCode: number, statusText: string, details: unknown = null) {
        super(message);

        this.statusCode = statusCode;
        this.statusText = statusText;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}

export { AppError };
