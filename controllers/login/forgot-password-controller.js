import bcrypt from 'bcrypt';
import { z } from 'zod';
import { UserModel } from '../../models/user.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import HttpError from '../../lib/http-error.js';

const requestSchema = z.object({
  email: z.string().email(),
  newPassword: z.string(),
});

/**
 * Forgot password controller
 * @type {import('../../types.js').RequestController}
 */
export async function forgotPasswordController(request) {
  const requestBody = requestSchema.parse(request.body);

  const existingUser = await UserModel.findOne({
    email: requestBody.email,
  });

  if (!existingUser) {
    throw new HttpError({
      message: 'Invalid email',
      statusCode: 401,
      name: 'UnauthorizedError',
    });
  }

  const hashedPassword = await bcrypt.hash(requestBody.newPassword, 10);

  await UserModel.updateOne({ _id: existingUser._id }, { password: hashedPassword });

  return new ApiSuccessResponse({
    message: 'Password reset successfully',
    data: {},
    statusCode: 201,
  });
}
