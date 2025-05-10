import { z } from 'zod';
import { MatchModel } from '../../models/match.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
import { createNotification } from '../../lib/create-notification.js';

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

  const match = await MatchModel.denyMatch({
    matchId,
    userId: currentUserId,
    rejectReason,
  });

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
