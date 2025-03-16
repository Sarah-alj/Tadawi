import { z } from 'zod';
import { UserModel } from '../../models/user.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
const requestSchema = z.object({});
const requestHandler = async ({ request, requestBody, }) => {
    const donorId = request.params.donorId;
    const user = await UserModel.findById(donorId).select('-passsword');
    return new ApiSuccessResponse({
        message: 'Donation created successfully',
        statusCode: 201,
        data: user,
    });
};
export const getDonorController = {
    requestSchema,
    requestHandler,
};
