import bcrypt from 'bcrypt';
import { z } from 'zod';
import { UserModel } from '../../models/user.model.js';
import { EmailService } from '../../services/email-service.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import HttpError from '../../lib/http-error.js';
import { generateOTP } from '../../lib/utils.js';

const requestSchema = z.object({
  userType: z.enum(['patient', 'doctor', 'donorAcquirer']),
  email: z.string().email(),
  password: z.string(),
});

/**
 * Login controller
 * @type {import('../../types.js').RequestController}
 */
export async function loginController(request) {
  const requestBody = requestSchema.parse(request.body);


  const loginResponse = await UserModel.loginUser(
    requestBody.email,
    requestBody.password,
    requestBody.userType
  )

  EmailService.getInstance().sendOtpEmail(loginResponse);

  return new ApiSuccessResponse({
    message: 'User logged in successfully',
    data: {
      otp: loginResponse.otp,
    },
    statusCode: 200,
  });
}
