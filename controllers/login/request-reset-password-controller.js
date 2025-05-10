import { z } from 'zod';
import { UserModel } from '../../models/user.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { EmailService } from '../../services/email-service.js';

const requestSchema = z.object({
  email: z.string().email(),
});

/**
 * Forgot password controller
 * @type {import('../../types.js').RequestController}
 */
export async function requestResetPassword(request) {
  const requestBody = requestSchema.parse(request.body);

  const { email, name, resetPasswordOtp } = await UserModel.requestResetPassword(requestBody.email);

  EmailService.getInstance().sendResetPasswordOtp({
    name: name,
    email: email,
    otp: resetPasswordOtp,
  });

  return new ApiSuccessResponse({
    message: 'Reset password OTP sent successfully',
    data: {},
    statusCode: 201,
  });
}
