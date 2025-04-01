import { MatchModel } from '../../models/match.model.js';
import { UserModel } from '../../models/user.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import HttpError from '../../lib/http-error.js';
import { checkAuth } from '../../lib/check-auth.js';

/**
 * Get single match controller
 * @type {import('../../types.js').RequestController}
 */
export async function getSingleMatchController(request) {
  const authUser = await checkAuth(request, ['patient', 'doctor']);
  const currentUserId = authUser._id.toString();

  const { matchId } = request.params;

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
  if (!user) {
    throw new HttpError({
      name: 'Not Found',
      message: 'User not found',
      statusCode: 404,
    });
  }

  return new ApiSuccessResponse({
    data: user,
    statusCode: 200,
    message: 'All matches fetched successfully',
  });
}
