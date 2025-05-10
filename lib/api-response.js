import HttpError from './http-error.js';

export class ApiSuccessResponse {
  statusCode;
  data;
  message;

  /**
   * @constructor
   * @param {Object} param
   * @param {number} [param.statusCode]
   * @param {string} [param.message]
   * @param {unknown} param.data
   */
  constructor({ statusCode = 200, message = 'Success', data }) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}
export class ApiErrorResponse {
  statusCode;
  name;
  message;
  error;

  /**
   * @constructor
   * @param {HttpError} error
   */
  constructor(error) {
    this.name = error.name;
    this.statusCode = error.statusCode;
    this.message = error.message;
    if (error.error) this.error = error.error;
  }
}
