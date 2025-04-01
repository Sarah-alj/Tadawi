import { MessageModel } from '../../models/message.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';

/**
 * Get all messages of a match
 * @type {import('../../types.js').RequestController}
 */
export async function getAllMessages(request) {
  await checkAuth(request, ['doctor', 'patient']);

  const matchId = request.params.matchId;

  const messages = await MessageModel.find({
    matchId: matchId,
  })
    .select('sender type content document createdAt')
    .sort({ createdAt: 1 });

  return new ApiSuccessResponse({ data: messages });
}
