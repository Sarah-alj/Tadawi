import { z } from 'zod';
import { MatchModel } from '../../models/match.model.js';
import { UserModel } from '../../models/user.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
const requestSchema = z.object({});
const requestHandler = async ({ request }) => {
    const authUser = await checkAuth(request, ['doctor', 'patient']);
    const currentUserId = authUser.id;
    const myMatches = await MatchModel.find({
        $or: [{ user1: currentUserId }, { user2: currentUserId }],
    });
    const myMatchedUserIdsToMatchIdsMap = new Map();
    myMatches.forEach((match) => {
        if (match.user1.toString() === currentUserId) {
            myMatchedUserIdsToMatchIdsMap.set(match.user2.toString(), match.id);
        }
        else {
            myMatchedUserIdsToMatchIdsMap.set(match.user1.toString(), match.id);
        }
    });
    const myMatchedUserIds = Array.from(myMatchedUserIdsToMatchIdsMap.keys());
    const users = await UserModel.find({
        _id: { $in: myMatchedUserIds },
    });
    const contacts = users.map((user) => ({
        userId: user.id,
        name: user.name,
        matchId: myMatchedUserIdsToMatchIdsMap.get(user.id),
    }));
    return new ApiSuccessResponse({ data: contacts });
};
export const getChatContacts = {
    requestSchema,
    requestHandler,
};
