import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';

/**
 * Get my profile
 * @type {import('../../types.js').RequestController}
 */
export async function getMyProfile(request) {
  const authUser = await checkAuth(request, ['doctor', 'patient', 'donorAcquirer']);

  const profile = await authUser.getMyProfile();

  return new ApiSuccessResponse({
    data: profile,
  });
}
