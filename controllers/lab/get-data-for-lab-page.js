import { z } from 'zod';
import { UserModel } from '../../models/user.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
const requestSchema = z.object({});
const requestHandler = async ({ request, }) => {
    const authUser = await checkAuth(request, 'doctor');
    const patients = await UserModel.find({
        userType: 'patient',
    }).select('name _id');
    const doctorData = {
        name: authUser.name,
        email: authUser.email,
    };
    return new ApiSuccessResponse({
        data: {
            doctorData,
            patients,
        },
    });
};
export const getDataForLabPage = {
    requestSchema,
    requestHandler,
};
