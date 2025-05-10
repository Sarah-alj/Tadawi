import { ApiSuccessResponse } from '../../lib/api-response.js';

/**
 * Logout controller
 * @type {import('../../types.js').RequestController}
 */
export async function logoutController(request) {
  await new Promise((resolve, reject) => {
    request.session.destroy((error) => {
      if (error) {
        reject(error);
      } else {
        resolve('Session destroyed');
      }
    });
  });

  return new ApiSuccessResponse({
    message: 'User logged in successfully',
    data: null,
    statusCode: 200,
  });
}
