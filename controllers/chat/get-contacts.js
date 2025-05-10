import { MatchModel } from '../../models/match.model.js';
import { UserModel } from '../../models/user.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';

/**
 * Get chat contacts
 * @type {import('../../types.js').RequestController}
 */
export async function getChatContacts(request) {
  const authUser = await checkAuth(request, ['doctor', 'patient']);

  const currentUserId = authUser.id;

  const contacts = await MatchModel.getContactsForChat(currentUserId);

  return new ApiSuccessResponse({ data: contacts });
}
