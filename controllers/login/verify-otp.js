import { z } from 'zod';
import { UserModel } from '../../models/user.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import HttpError from '../../lib/http-error.js';

const requestSchema = z.object({
  otp: z.string(),
  email: z.string().email(),
  userType: z.enum(['patient', 'doctor', 'donorAcquirer']),
});

/**
 * Verify otp controller
 * @type {import('../../types.js').RequestController}
 */
export async function verifyOtpController(request) {
  const requestBody = requestSchema.parse(request.body);

  const existingUser = await UserModel.findOne({
    email: requestBody.email,
    userType: requestBody.userType,
  });

  if (!existingUser) {
    throw new HttpError({
      message: 'Invalid email or otp',
      statusCode: 401,
      name: 'UnauthorizedError',
    });
  }

  if (existingUser.otp !== requestBody.otp) {
    throw new HttpError({
      message: 'Invalid email or otp',
      statusCode: 401,
      name: 'UnauthorizedError',
    });
  }

  request.session.userId = existingUser._id.toString();

  const { password, ...userWithoutPassword } = existingUser.toObject();

  return new ApiSuccessResponse({
    message: 'User logged in successfully',
    statusCode: 200,
    data: {
      user: userWithoutPassword,
    },
  });
}
