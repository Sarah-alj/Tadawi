import { z } from 'zod';
import { DonationModel } from '../../models/donation.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';

const requestSchema = z.object({
  equipmentType: z.string().nonempty(),
  equipmentName: z.string().nonempty(),
  equipmentDescription: z.string().nonempty(),
  yearsOfUse: z.coerce.number().positive(),
  warrantyDetails: z.string().optional(),
  defects: z.string().optional(),
  pointOfContact: z.string().nonempty(),
  details: z.string().nonempty(),
});

/**
 * Create a new donation
 * @type {import('../../types.js').RequestController}
 */
export async function createDonationController(request) {
  const authUser = await checkAuth(request, ['donorAcquirer']);

  const validRequest = requestSchema.parse(request.body);

  const currentUserId = authUser._id;
  const newDonation = new DonationModel({
    ...validRequest,
    userId: currentUserId,
  });
  await newDonation.save();

  return new ApiSuccessResponse({
    message: 'Donation created successfully',
    statusCode: 201,
    data: newDonation,
  });
}
