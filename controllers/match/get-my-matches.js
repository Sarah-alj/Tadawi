import { DoctorModel } from '../../models/doctor.model.js';
import { PatientModel } from '../../models/patient.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import HttpError from '../../lib/http-error.js';
import { checkAuth } from '../../lib/check-auth.js';

/**
 * Get my matches controller
 * @type {import('../../types.js').RequestController}
 */
export async function getMyMatchesController(request) {
  const authUser = await checkAuth(request, ['patient', 'doctor']);
  const currentUserId = authUser._id.toString();

  if (authUser.userType === 'doctor') {
    const doctorProfile = await DoctorModel.findOne({ user: currentUserId });
    if (!doctorProfile) {
      throw new HttpError({
        name: 'NotFound',
        message: 'Doctor profile not found',
        statusCode: 404,
      });
    }
    const matches = await doctorProfile.getMyMatches();
    return new ApiSuccessResponse({
      data: matches,
      statusCode: 200,
      message: 'All matches fetched successfully',
    });
  }

  if (authUser.userType === 'patient') {
    const patientProfile = await PatientModel.findOne({ user: currentUserId });
    if (!patientProfile) {
      throw new HttpError({
        name: 'NotFound',
        message: 'Patient profile not found',
        statusCode: 404,
      });
    }
    const matches = await patientProfile.getMyMatches();
    return new ApiSuccessResponse({
      data: matches,
      statusCode: 200,
      message: 'All matches fetched successfully',
    });
  }

  throw new HttpError({
    name: 'BadRequest',
    message: 'Invalid user type',
    statusCode: 400,
  });
}
