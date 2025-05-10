import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';

/**
 * Delete all notifications
 * @type {import('../../types.js').RequestController}
 */
export async function deleteAllNotification(request) {
  const authUser = await checkAuth(request, ['doctor', 'patient', 'donorAcquirer']);

  await authUser.deleteAllNotifications();

  return new ApiSuccessResponse({
    data: null,
  });
}
