import { z } from 'zod';
import { MatchModel } from '../../models/match.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
import { createNotification } from '../../lib/create-notification.js';
import HttpError from '../../lib/http-error.js';
const requestSchema = z.object({
    userId: z.string(),
});
const requestHandler = async ({ request, requestBody, }) => {
    const authUser = await checkAuth(request, ['patient', 'doctor']);
    const currentUserId = authUser._id;
    // check if the match already exists between the users
    const existingMatch = await MatchModel.findOne({
        $or: [
            { user1: currentUserId, user2: requestBody.userId },
            { user1: requestBody.userId, user2: currentUserId },
        ],
    });
    if (existingMatch) {
        throw new HttpError({
            message: 'Match already exists',
            statusCode: 400,
            name: 'BadRequestError',
        });
    }
    const newMatch = new MatchModel({
        user1: currentUserId,
        user2: requestBody.userId,
        status: authUser.userType === 'doctor' ? 'accepted' : 'pending',
    });
    await newMatch.save();
    createNotification({
        userId: requestBody.userId,
        senderId: currentUserId,
        eventType: 'match-request',
    });
    return new ApiSuccessResponse({
        message: 'Match created successfully',
        statusCode: 201,
        data: newMatch,
    });
};
export const createMatchController = {
    requestSchema,
    requestHandler,
};
