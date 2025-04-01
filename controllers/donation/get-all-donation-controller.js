import { DonationModel } from '../../models/donation.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';

import { z } from 'zod';

const getAllDonationsSchema = z.object({
  query: z.object({
    type: z.enum(['all', 'by-me', 'not-by-me']).default('all'),
    'is-taken': z.enum(['true', 'false', 'all']).default('all'),
  }),
});

/**
 * Get all donations
 * @type {import('../../types.js').RequestController}
 */
export async function getAllDonationsController(request) {
  const authUser = await checkAuth(request, ['donorAcquirer']);

  const currentUserId = authUser._id.toString();

  const { query } = getAllDonationsSchema.parse(request);

  const donations = await DonationModel.find({
    ...(query.type === 'by-me' && { userId: currentUserId }),
    ...(query.type === 'not-by-me' && { userId: { $ne: currentUserId } }),
    ...(query['is-taken'] === 'true' && { isTaken: true }),
    ...(query['is-taken'] === 'false' && { isTaken: false }),
  });

  return new ApiSuccessResponse({
    message: 'Donations fetched successfully',
    statusCode: 200,
    data: donations,
  });
}
