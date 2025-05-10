import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
import HttpError from '../../lib/http-error.js';
import { DonorAcquirerModel } from '../../models/donor.model.js';

/**
 * Get a single donor
 * @type {import('../../types.js').RequestController}
 */
export async function acquireDonation(request) {
  const authUser = await checkAuth(request, ['donorAcquirer']);

  const acquirer = await DonorAcquirerModel.findOne({ user: authUser._id }).populate('user');

  if (!acquirer) {
    throw new HttpError({
      statusCode: 403,
      message: 'You are not authorized to acquire donations',
      name: 'ForbiddenError',
    });
  }

  const donation = acquirer.acquireDonation(request.params.donationId);

  return new ApiSuccessResponse({
    message: 'Donation acquired successfully',
    statusCode: 200,
    data: donation,
  });
}
