import { z } from 'zod';
import { UserModel } from '../../models/user.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';

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

  const user = await UserModel.verifyOtp(
    requestBody.email,
    requestBody.otp,
    requestBody.userType
  );

  request.session.userId = user._id.toString();

  const { password, ...userWithoutPassword } = user.toObject();

  return new ApiSuccessResponse({
    message: 'User verified successfully',
    statusCode: 200,
    data: {
      user: userWithoutPassword,
    },
  });
}
