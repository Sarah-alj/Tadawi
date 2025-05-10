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
 * Create chat only match controller
 * @type {import('../../types.js').RequestController}
 */
export async function createChatOnlyMatchController(request) {
  const authUser = await checkAuth(request, ['patient', 'doctor']);
  const currentUserId = authUser._id.toString();

  const requestBody = requestSchema.parse(request.body);

  const newMatch = await MatchModel.createMatch({
    user1: currentUserId,
    user2: requestBody.userId,
    status: 'chat-only',
  });

  if (!newMatch) {
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
    relatedId: newMatch._id.toString(),
  });

  return new ApiSuccessResponse({
    message: 'Match created successfully',
    statusCode: 201,
    data: newMatch,
  });
}
