/**
 * @class HttpError
 * @description This class is used for creating an instance of an HTTP error with a custom status code, message, and data.
 */
class HttpError extends Error {
    statusCode;
    error;
    constructor({ name, statusCode, message, error, }) {
        super(message);
        this.message = message;
        this.name = name;
        this.statusCode = statusCode;
        if (error)
            this.error = error;
        Error.captureStackTrace(this, HttpError);
    }
}
export default HttpError;
