import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
import HttpError from '../../lib/http-error.js';
import { DoctorModel } from '../../models/doctor.model.js';

/**
 * Get all labs
 * @type {import('../../types.js').RequestController}
 */
export async function getAllLabs(request) {
  const authUser = await checkAuth(request, ['doctor', 'patient']);
  const authUserId = authUser._id.toString();

  const doctorProfile = await DoctorModel.findOne({
    user: authUserId,
  });

  if (!doctorProfile) {
    throw new HttpError({
      message: 'Unauthorized access',
      statusCode: 403,
      name: 'ForbiddenError',
    });
  }

  const labs = await doctorProfile.getMyLabBookings();

  return new ApiSuccessResponse({
    data: labs,
  });
}
