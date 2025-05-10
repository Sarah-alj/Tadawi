import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { DiseaseTypeModel } from '../../models/disease-type.model.js';
import { UserModel } from '../../models/user.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
import { handleBase64Upload } from '../../lib/file-upload.js';
import HttpError from '../../lib/http-error.js';
import { requestSchema } from './update-validation.js';
import { createNotification } from '../../lib/create-notification.js';

/**
 * Update my profile
 * @type {import('../../types.js').RequestController}
 */
export async function updateMyProfile(request) {
  const authUser = await checkAuth(request, ['doctor', 'patient', 'donorAcquirer']);

  const requestBody = requestSchema.parse(request.body);

  if (authUser.userType !== requestBody.userType) {
    throw new HttpError({
      message: 'User type mismatch',
      statusCode: 400,
      name: 'BadRequestError',
    });
  }

  const hashedPassword = await bcrypt.hash(requestBody.userDetails.password, 10);

  requestBody.userDetails.password = hashedPassword;

  if (requestBody.userType === 'patient') {
    //* UPDATE PATIENT
    const disease = await DiseaseTypeModel.findById(requestBody.medicalHistory.diseaseId);
    if (!disease) {
      throw new HttpError({
        message: 'Disease not found',
        statusCode: 404,
        name: 'NotFoundError',
      });
    }

    if (requestBody.patientDetails.idVerification) {
      requestBody.patientDetails.idVerification = await handleBase64Upload(
        requestBody.patientDetails.idVerification,
        randomBytes(16).toString('hex')
      );
    }

    await UserModel.updatePatientUser(authUser._id.toString(), {
      userDetails: requestBody.userDetails,
      patientDetails: requestBody.patientDetails,
      medicalHistory: { ...requestBody.medicalHistory, disease: disease },
    });
  } else if (requestBody.userType === 'doctor') {
    //* UPDATE DOCTOR

    if (requestBody.doctorDetails.license) {
      requestBody.doctorDetails.license = await handleBase64Upload(
        requestBody.doctorDetails.license,
        randomBytes(16).toString('hex')
      );
    }
    await UserModel.updateDoctorUser(authUser._id.toString(), {
      userDetails: requestBody.userDetails,
      doctorDetails: requestBody.doctorDetails,
      trialDetails: requestBody.trialDetails,
    });
  } else if (requestBody.userType === 'donorAcquirer') {
    //* UPDATE DONOR ACQUIRER
    await UserModel.updateDonorAcquirerUser(authUser._id.toString(), {
      userDetails: requestBody.userDetails,
      donorAcquirerDetails: requestBody.donorAcquirerDetails,
    });
  } else {
    throw new HttpError({
      message: 'Invalid user type',
      statusCode: 400,
      name: 'BadRequestError',
    });
  }

  createNotification({
    receiverId: authUser._id.toString(),
    senderId: authUser._id.toString(),
    eventType: 'profile-updated',
    relatedId: authUser._id.toString(),
  });

  return new ApiSuccessResponse({
    message: 'User updated successfully',
    statusCode: 200,
    data: null,
  });
}
