import { z } from 'zod';
import { MatchModel } from '../../models/match.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
import { createNotification } from '../../lib/create-notification.js';
import HttpError from '../../lib/http-error.js';

const requestSchema = z.object({
  matchId: z.string(),
  rejectReason: z.string(),
});

/**
 * Deny match controller
 * @type {import('../../types.js').RequestController}
 */
export async function denyMatchController(request) {
  const authUser = await checkAuth(request, ['patient', 'doctor']);
  const currentUserId = authUser._id.toString();

  const requestBody = requestSchema.parse(request.body);

  const { matchId, rejectReason } = requestBody;

  const match = await MatchModel.findById(matchId);

  if (!match) {
    throw new HttpError({
      name: 'Not Found',
      message: 'Match not found',
      statusCode: 404,
    });
  }

  if (match.user1.toString() === currentUserId) {
    throw new HttpError({
      name: 'Unauthorized',
      message: "This request is sent by you. You can't reject it. Only the other user can reject it.",
      statusCode: 401,
    });
  }

  if (match.user2.toString() !== currentUserId) {
    throw new HttpError({
      name: 'Unauthorized',
      message: 'You are not authorized to access this resource',
      statusCode: 401,
    });
  }

  match.status = 'rejected';
  match.rejectReason = rejectReason;
  await match.save();
  createNotification({
    receiverId: match.user1.toString(),
    senderId: currentUserId,
    eventType: 'match-reject',
    relatedId: match._id.toString(),
  });
  return new ApiSuccessResponse({
    data: match,
    statusCode: 200,
    message: 'Match rejected successfully',
  });
}
