import { z } from 'zod';
import { MatchModel } from '../../models/match.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
import { createNotification } from '../../lib/create-notification.js';
import HttpError from '../../lib/http-error.js';

const requestSchema = z.object({
  userId: z.string(),
});
/**
 * Create match controller
 * @type {import('../../types.js').RequestController}
 */
export async function createMatchController(request) {
  const authUser = await checkAuth(request, ['patient', 'doctor']);
  const currentUserId = authUser._id.toString();

  const requestBody = requestSchema.parse(request.body);

  const match = await MatchModel.createMatch({
    user1: currentUserId,
    user2: requestBody.userId,
    status: authUser.userType === 'doctor' ? 'accepted' : 'pending',
  });

  if (!match) {
    throw new HttpError({
      message: 'Match already exists',
      statusCode: 400,
      name: 'BadRequestError',
    });
  }

  createNotification({
    receiverId: requestBody.userId,
    senderId: currentUserId,
    eventType: 'match-request',
    relatedId: match._id.toString(),
  });

  return new ApiSuccessResponse({
    message: 'Match created successfully',
    statusCode: 201,
    data: match,
  });
}
