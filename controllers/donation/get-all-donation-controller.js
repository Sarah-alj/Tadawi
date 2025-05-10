import { DonationModel } from '../../models/donation.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';

import { z } from 'zod';
import { DonorAcquirerModel } from '../../models/donor.model.js';
import HttpError from '../../lib/http-error.js';

const getAllDonationsSchema = z.object({
  query: z.object({
    type: z.enum(['all', 'by-me', 'not-by-me']).default('all'),
  }),
});

/**
 * Get all donations
 * @type {import('../../types.js').RequestController}
 */
export async function getAllDonationsController(request) {
  const authUser = await checkAuth(request, ['donorAcquirer']);

  const donor = await DonorAcquirerModel.findOne({ user: authUser._id });

  if (!donor) {
    throw new HttpError({
      message: 'Donor not found',
      statusCode: 404,
      name: 'NotFoundError',
    });
  }

  const currentUserId = authUser._id.toString();

  const { query } = getAllDonationsSchema.parse(request);

  if (query.type === 'by-me') {
    const donations = await donor.viewMyDonations();

    return new ApiSuccessResponse({
      message: 'Donations fetched successfully',
      statusCode: 200,
      data: donations,
    });
  }

  const donations = await DonationModel.find({
    userId: { $ne: currentUserId },
    isTaken: false,
  });

  return new ApiSuccessResponse({
    message: 'Donations fetched successfully',
    statusCode: 200,
    data: donations,
  });
}
