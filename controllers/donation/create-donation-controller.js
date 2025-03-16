import { z } from 'zod';
import { DonationModel } from '../../models/donation.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
const requestSchema = z.object({
    equipmentName: z.string(),
    equipmentDescription: z.string(),
    yearsOfUse: z.coerce.number().positive(),
    warrantyDetails: z.string().optional(),
    defects: z.string().optional(),
    pointOfContact: z.string(),
    details: z.string(),
});
const requestHandler = async ({ request, requestBody, }) => {
    const authUser = await checkAuth(request, ['donorAcquirer']);
    const currentUserId = authUser._id;
    const newDonation = new DonationModel({
        ...requestBody,
        userId: currentUserId,
    });
    await newDonation.save();
    return new ApiSuccessResponse({
        message: 'Donation created successfully',
        statusCode: 201,
        data: newDonation,
    });
};
export const createDonationController = {
    requestSchema,
    requestHandler,
};
