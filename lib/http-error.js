/**
 * @class HttpError
 * @description This class is used for creating an instance of an HTTP error with a custom status code, message, and data.
 */
class HttpError extends Error {
  statusCode;
  error;

  /**
   * @constructor
   * @param {Object} options
   * @param {"NotFoundError" | "BadRequestError" | "UnauthorizedError" | "ForbiddenError" | "InternalServerError" | (string & {})} options.name
   * @param {number} options.statusCode
   * @param {string} options.message
   * @param {Record<string, unknown>} [options.error]
   */
  constructor({ name, statusCode, message, error }) {
    super(message);
    this.message = message;
    this.name = name;
    this.statusCode = statusCode;
    if (error) this.error = error;
    Error.captureStackTrace(this, HttpError);
  }
}
export default HttpError;
