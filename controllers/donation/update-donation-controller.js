import { z } from 'zod';
import { DonationModel } from '../../models/donation.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
import HttpError from '../../lib/http-error.js';
import { createNotification } from '../../lib/create-notification.js';
import { DonorAcquirerModel } from '../../models/donor.model.js';

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
 * Update a donation
 * @type {import('../../types.js').RequestController}
 */
export async function updateDonationController(request) {
  const authUser = await checkAuth(request, ['donorAcquirer']);

  const validRequest = requestSchema.parse(request.body);

  const currentUserId = authUser._id.toString();
  const donationId = request.params.donationId;

  const donor = await DonorAcquirerModel.findOne({ user: currentUserId }).populate('user');

  if (!donor) {
    throw new HttpError({
      statusCode: 403,
      message: 'You are not authorized to update this donation',
      name: 'ForbiddenError',
    });
  }

  await donor.editDonation(donationId, validRequest);

  createNotification({
    receiverId: currentUserId,
    senderId: currentUserId,
    eventType: 'donation-updated',
    relatedId: donationId,
  });

  return new ApiSuccessResponse({
    message: 'Donation updated successfully',
    statusCode: 200,
    data: null,
  });
}
