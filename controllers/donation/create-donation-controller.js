import { z } from 'zod';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
import { DonorAcquirerModel } from '../../models/donor.model.js';
import HttpError from '../../lib/http-error.js';

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

  const donor = await DonorAcquirerModel.findOne({ user: currentUserId });

  if (!donor) {
    throw new HttpError({
      name: 'NotFoundError',
      message: 'Donor not found',
      statusCode: 404,
    });
  }

  const newDonation = await donor.createDonation({
    ...validRequest,
    userId: currentUserId,
  });

  return new ApiSuccessResponse({
    message: 'Donation created successfully',
    statusCode: 201,
    data: newDonation,
  });
}
