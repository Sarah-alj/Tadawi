import { DonationModel } from '../../models/donation.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
import HttpError from '../../lib/http-error.js';
import { createNotification } from '../../lib/create-notification.js';

/**
 * Delete a donation
 * @type {import('../../types.js').RequestController}
 */
export async function deleteDonationController(request) {
  const authUser = await checkAuth(request, ['donorAcquirer']);
  const currentUserId = authUser._id.toString();
  const donationId = request.params.donationId;

  const donation = await DonationModel.findOne({ _id: donationId });

  if (!donation) {
    return new ApiSuccessResponse({
      data: null,
      message: 'Donation already deleted',
      statusCode: 200,
    });
  }

  if (donation.userId.toString() !== currentUserId) {
    throw new HttpError({
      name: 'Forbidden',
      message: 'You are not allowed to delete this donation',
      statusCode: 403,
    });
  }

  await DonationModel.deleteOne({ _id: donationId });

  createNotification({
    receiverId: currentUserId,
    senderId: currentUserId,
    eventType: 'donation-deleted',
  });

  return new ApiSuccessResponse({
    message: 'Donation deleted successfully',
    statusCode: 200,
    data: null,
  });
}
