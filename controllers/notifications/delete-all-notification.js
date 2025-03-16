import { z } from 'zod';
import { NotificationModel } from '../../models/notification.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
const requestSchema = z.object({});
const requestHandler = async ({ request }) => {
    const authUser = await checkAuth(request, [
        'doctor',
        'patient',
        'donorAcquirer',
    ]);
    await NotificationModel.deleteMany({
        user: authUser._id,
    });
    return new ApiSuccessResponse({
        data: null,
    });
};
export const deleteAllNotification = {
    requestSchema,
    requestHandler,
};
