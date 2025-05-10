import { MatchModel } from '../../models/match.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
import { createNotification } from '../../lib/create-notification.js';

/**
 * Accept match controller
 * @type {import('../../types.js').RequestController}
 */
export async function acceptMatchController(request) {
  const authUser = await checkAuth(request, ['patient', 'doctor']);
  const currentUserId = authUser._id.toString();

  const { matchId } = request.params;

  const match = await MatchModel.acceptMatch({
    matchId: matchId,
    userId: currentUserId,
  });

  createNotification({
    receiverId: match.user1.toString(),
    senderId: currentUserId,
    eventType: 'match-accept',
    relatedId: match._id.toString(),
  });
  return new ApiSuccessResponse({
    data: match,
    statusCode: 200,
    message: 'Match accepted successfully',
  });
}
