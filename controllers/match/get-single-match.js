import { z } from 'zod';
import { MatchModel } from '../../models/match.model.js';
import { UserModel } from '../../models/user.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import HttpError from '../../lib/http-error.js';
const requestSchema = z.object({});
const requestHandler = async ({ request }) => {
    const currentUserId = request.session.userId;
    const { matchId } = request.params;
    if (!currentUserId) {
        throw new HttpError({
            name: 'Unauthorized',
            message: 'You are not authorized to access this resource',
            statusCode: 401,
        });
    }
    const match = await MatchModel.findById(matchId).lean();
    if (!match) {
        throw new HttpError({
            name: 'Not Found',
            message: 'Match not found',
            statusCode: 404,
        });
    }
    const otherUserId = match.user1.toString() === currentUserId ? match.user2 : match.user1;
    const user = await UserModel.findById(otherUserId).select('-password').lean();
    return new ApiSuccessResponse({
        data: user,
        statusCode: 200,
        message: 'All matches fetched successfully',
    });
};
export const getSingleMatchController = { requestSchema, requestHandler };
