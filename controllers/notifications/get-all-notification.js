import { NotificationModel } from '../../models/notification.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';

/**
 * Get all notifications
 * @type {import('../../types.js').RequestController}
 */
export async function getAllNotification(request) {
  const authUser = await checkAuth(request, ['doctor', 'patient', 'donorAcquirer']);
  const notifications = await NotificationModel.find({
    user: authUser._id,
  }).sort({ createdAt: -1 });
  return new ApiSuccessResponse({
    data: notifications,
  });
}
