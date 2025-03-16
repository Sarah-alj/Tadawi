import { z } from 'zod';
import { MatchModel } from '../../models/match.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
import { createNotification } from '../../lib/create-notification.js';
import HttpError from '../../lib/http-error.js';
const requestSchema = z.object({});
const requestHandler = async ({ request }) => {
    const authUser = await checkAuth(request, ['patient', 'doctor']);
    const currentUserId = authUser._id;
    const { matchId } = request.params;
    const match = await MatchModel.findById(matchId);
    if (!match) {
        throw new HttpError({
            name: 'Not Found',
            message: 'Match not found',
            statusCode: 404,
        });
    }
    if (match.user1.toString() === currentUserId) {
        throw new HttpError({
            name: 'Unauthorized',
            message: "This request is sent by you. You can't accept it. Only the other user can accept it.",
            statusCode: 401,
        });
    }
    if (match.user2.toString() === currentUserId) {
        match.status = 'accepted';
        await match.save();
        createNotification({
            userId: match.user1.toString(),
            senderId: currentUserId,
            eventType: 'match-accept',
        });
        return new ApiSuccessResponse({
            data: match,
            statusCode: 200,
            message: 'Match accepted successfully',
        });
    }
    throw new HttpError({
        name: 'Unauthorized',
        message: 'You are not authorized to access this resource',
        statusCode: 401,
    });
};
export const acceptMatchController = { requestSchema, requestHandler };
