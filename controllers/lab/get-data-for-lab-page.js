import { UserModel } from '../../models/user.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';

/**
 * Get data for lab page
 * @type {import('../../types.js').RequestController}
 */
export async function getDataForLabPage(request) {
  const authUser = await checkAuth(request, 'doctor');
  const patients = await UserModel.find({
    userType: 'patient',
  }).select('name _id');
  const doctorData = {
    name: authUser.name,
    email: authUser.email,
  };
  return new ApiSuccessResponse({
    data: {
      doctorData,
      patients,
    },
  });
}
