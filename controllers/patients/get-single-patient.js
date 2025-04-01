import { z } from 'zod';
import { UserModel } from '../../models/user.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import HttpError from '../../lib/http-error.js';
import { checkAuth } from '../../lib/check-auth.js';

/**
 * Get single patient
 * @type {import('../../types.js').RequestController}
 */
export async function getSinglePatient(request) {
  const authUser = await checkAuth(request, ['doctor', 'patient']);

  const { patientId } = request.params;

  const patient = await UserModel.findById(patientId).select('-password');

  if (!patient)
    throw new HttpError({
      statusCode: 404,
      message: 'No patient found',
      name: 'Not Found Error',
    });

  return new ApiSuccessResponse({
    statusCode: 200,
    data: patient,
    message: 'Patient fetched successfully',
  });
}
