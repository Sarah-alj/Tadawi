import { ApiErrorResponse } from '../lib/api-response.js';
import HttpError from '../lib/http-error.js';

/**
 * Error handler middleware
 * @param {Error} error
 * @param {import('express').Request} _
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} __
 */
const errorHandler = (error, _, response, __) => {
  if (error instanceof HttpError) {
    response.status(error.statusCode).json(new ApiErrorResponse(error));
    return;
  }
  const status = response.statusCode === 200 ? 500 : response.statusCode;
  response.status(status).json(
    new ApiErrorResponse(
      new HttpError({
        name: error.name || 'InternalServerError',
        message: error.message || 'Internal Server Error',
        statusCode: status,
      })
    )
  );
};
export default errorHandler;
