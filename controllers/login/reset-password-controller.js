import { z } from 'zod';
import { UserModel } from '../../models/user.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';

const requestSchema = z.object({
  email: z.string().email(),
  otp: z.string(),
  newPassword: z.string(),
});

/**
 * Forgot password controller
 * @type {import('../../types.js').RequestController}
 */
export async function resetPasswordController(request) {
  const requestBody = requestSchema.parse(request.body);

  await UserModel.resetPassword(requestBody);

  return new ApiSuccessResponse({
    message: 'Password reset successfully',
    data: {},
    statusCode: 201,
  });
}
