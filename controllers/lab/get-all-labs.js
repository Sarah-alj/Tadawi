import { LabModel } from '../../models/lab.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
import HttpError from '../../lib/http-error.js';

/**
 * Get all labs
 * @type {import('../../types.js').RequestController}
 */
export async function getAllLabs(request) {
  const authUser = await checkAuth(request, ['doctor', 'patient']);
  const userType = authUser.userType;
  const authUserId = authUser._id.toString();

  if (userType === 'doctor') {
    const labs = await getLabsAsDoctor(authUserId);
    return new ApiSuccessResponse({
      data: labs,
    });
  }

  throw new HttpError({
    message: 'Unauthorized access',
    statusCode: 403,
    name: 'ForbiddenError',
  });
}

/**
 * Get labs as doctor
 * @param {string} userId
 * @returns {Promise<Array<unknown>>}
 */
async function getLabsAsDoctor(userId) {
  const labs = await LabModel.find({ doctor: userId }).populate('patient', 'name');
  return labs;
}
