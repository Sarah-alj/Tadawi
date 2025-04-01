import { z } from 'zod';
import { ApiErrorResponse, ApiSuccessResponse } from './api-response.js';
import HttpError from './http-error.js';
import formatZodError from './utils.js';

/**
 * @description Wraps a request handler with request schema validation and error handling
 * @param {(request: import('express').Request) => Promise<ApiSuccessResponse>} requestHandler
 * @returns {import("express").RequestHandler}
 */
export function requestHandlerWrapper(requestHandler) {
  return async (request, response) => {
    try {
      const responseBody = await requestHandler(request);
      response.status(responseBody.statusCode).json(responseBody);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const { conciseErrorMessages, errorObject } = formatZodError(error);
        const responseBody = new ApiErrorResponse(
          new HttpError({
            name: 'BadRequestError',
            message: conciseErrorMessages,
            statusCode: 400,
            error: errorObject,
          })
        );
        response.status(400).json(responseBody);
        return;
      }
      if (error instanceof HttpError) {
        response.status(error.statusCode).json(new ApiErrorResponse(error));
        return;
      }
      throw error;
    }
  };
}
