import { z } from 'zod';
import { ApiErrorResponse } from './api-response.js';
import HttpError from './http-error.js';
import formatZodError from './utils.js';
export function requestHandlerWrapper({ requestSchema, requestHandler, }) {
    return async (request, response) => {
        try {
            const requestBody = requestSchema.parse({
                ...request.body,
                ...request.query,
            });
            const responseBody = await requestHandler({
                requestBody,
                request,
            });
            const { cookies, ...responseBodyWithoutCookie } = responseBody;
            if (cookies?.length) {
                cookies.forEach((cookie) => {
                    response.cookie(cookie.name, cookie.value, cookie.options);
                });
            }
            response.status(responseBody.statusCode).json(responseBodyWithoutCookie);
            return;
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                const { conciseErrorMessages, errorObject } = formatZodError(error);
                const responseBody = new ApiErrorResponse(new HttpError({
                    name: 'BadRequestError',
                    message: conciseErrorMessages,
                    statusCode: 400,
                    error: errorObject,
                }));
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
