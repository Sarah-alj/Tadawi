import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
import { DonationModel } from '../../models/donation.model.js';

/**
 * Get a single donor
 * @type {import('../../types.js').RequestController}
 */
export async function getSingleDonation(request) {
  await checkAuth(request, ['donorAcquirer']);

  const donationId = request.params.donationId;
  const donation = await DonationModel.findById(donationId);

  return new ApiSuccessResponse({
    message: 'Donation created successfully',
    statusCode: 201,
    data: donation,
  });
}
