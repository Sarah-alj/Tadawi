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
  const existingUser = await UserModel.findOne({
    email: requestBody.email,
    userType: requestBody.userType,
  });
  if (!existingUser) {
    throw new HttpError({
      message: 'Invalid email or password',
      statusCode: 401,
      name: 'UnauthorizedError',
    });
  }
  const passwordMatch = await bcrypt.compare(requestBody.password, existingUser.password);
  if (!passwordMatch) {
    throw new HttpError({
      message: 'Invalid email or password',
      statusCode: 401,
      name: 'UnauthorizedError',
    });
  }
  const otp = generateOTP();
  await UserModel.updateOne({ _id: existingUser._id }, { otp });
  const emailService = EmailService.getInstance();
  emailService.sendOtpEmail({
    name: existingUser.name,
    email: existingUser.email,
    otp: otp,
  });
  return new ApiSuccessResponse({
    message: 'User logged in successfully',
    data: {
      otp: otp,
    },
    statusCode: 200,
  });
}
