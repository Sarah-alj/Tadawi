import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
import HttpError from '../../lib/http-error.js';
import { DonationModel } from '../../models/donation.model.js';

/**
 * Get a single donor
 * @type {import('../../types.js').RequestController}
 */
export async function acquireDonation(request) {
  await checkAuth(request, ['donorAcquirer']);

  const donationId = request.params.donationId;
  const donation = await DonationModel.findById(donationId);

  if (!donation) {
    throw new HttpError({
      statusCode: 404,
      message: 'Donation not found',
      name: 'NotFoundError',
    });
  }

  await DonationModel.updateOne({ _id: donation._id }, { $set: { isTaken: true } });

  return new ApiSuccessResponse({
    message: 'Donation acquired successfully',
    statusCode: 200,
    data: donation,
  });
}
