import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
import { DonorAcquirerModel } from '../../models/donor.model.js';
import HttpError from '../../lib/http-error.js';

/**
 * Get single donation
 * @type {import('../../types.js').RequestController}
 */
export async function getSingleDonationController(request) {
  const authUser = await checkAuth(request, ['donorAcquirer']);

  const donorAcquirer = await DonorAcquirerModel.findOne({
    user: authUser._id,
  });

  if (!donorAcquirer) {
    throw new HttpError({
      statusCode: 403,
      message: 'You are not authorized to view this donation',
      name: 'ForbiddenError',
    });
  }

  const donation = await donorAcquirer.viewSingleDonation(request.params.donationId);

  return new ApiSuccessResponse({
    message: 'Donation fetched successfully',
    statusCode: 200,
    data: donation,
  });
}
