import { UserModel } from '../../models/user.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import HttpError from '../../lib/http-error.js';
import { checkAuth } from '../../lib/check-auth.js';

/**
 * Get patient contact info
 * @type {import('../../types.js').RequestController}
 */
export async function getPatientContactInfo(request) {
  const authUser = await checkAuth(request, ['doctor', 'patient']);

  const { patientId } = request.params;

  const patient = await UserModel.findById(patientId).select('name email phoneNumber');

  if (!patient) {
    throw new HttpError({
      statusCode: 404,
      message: 'No patient found',
      name: 'Not Found Error',
    });
  }

  return new ApiSuccessResponse({
    statusCode: 200,
    data: patient,
    message: 'Patient fetched successfully',
  });
}
