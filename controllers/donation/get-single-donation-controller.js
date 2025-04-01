import { DonationModel } from '../../models/donation.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';

/**
 * Get single donation
 * @type {import('../../types.js').RequestController}
 */
export async function getSingleDonationController(request) {
  const authUser = await checkAuth(request, ['donorAcquirer']);

  const currentUserId = authUser._id.toString();

  const donationId = request.params.donationId;

  const donation = await DonationModel.findOne({
    _id: donationId,
  });

  if (!donation) {
    return new ApiSuccessResponse({
      message: 'Donation not found',
      statusCode: 404,
      data: null,
    });
  }

  return new ApiSuccessResponse({
    message: 'Donation fetched successfully',
    statusCode: 200,
    data: donation,
  });
}
