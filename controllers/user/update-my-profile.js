import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import mongoose from 'mongoose';
import { DiseaseTypeModel } from '../../models/disease-type.model.js';
import { DoctorModel } from '../../models/doctor.model.js';
import { DonorAcquirerModel } from '../../models/donor.model.js';
import { PatientMedicalHistoryModel } from '../../models/medicalHistory.model.js';
import { PatientModel } from '../../models/patient.model.js';
import { TrialModel } from '../../models/trial.model.js';
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
    await handlePatientUpdate(requestBody, authUser._id.toString());
  } else if (requestBody.userType === 'doctor') {
    await handleDoctorUpdate(requestBody, authUser._id.toString());
  } else if (requestBody.userType === 'donorAcquirer') {
    await handleDonorAcquirerUpdate(requestBody, authUser._id.toString());
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

/**
 * Handle patient update
 * @param {any} data
 * @param {string} existingUserId
 */
async function handlePatientUpdate(data, existingUserId) {
  const disease = await DiseaseTypeModel.findById(data.medicalHistory.diseaseId);
  if (!disease) {
    throw new HttpError({
      message: 'Disease not found',
      statusCode: 404,
      name: 'NotFoundError',
    });
  }
  if (data.patientDetails.idVerification) {
    data.patientDetails.idVerification = await handleBase64Upload(
      data.patientDetails.idVerification,
      randomBytes(16).toString('hex')
    );
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await UserModel.findOneAndUpdate({ _id: existingUserId }, data.userDetails, { session });
    const patient = await PatientModel.findOneAndUpdate({ user: existingUserId }, data.patientDetails, {
      new: true,
      session,
    });
    if (!patient) {
      throw new HttpError({
        message: 'Patient not found',
        statusCode: 404,
        name: 'NotFoundError',
      });
    }
    await PatientMedicalHistoryModel.findOneAndUpdate(
      { patient: patient._id },
      { ...data.medicalHistory, disease: disease },
      { new: true, session }
    );
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}

/**
 * Handle doctor update
 * @param {any} data
 * @param {string} existingUserId
 */
async function handleDoctorUpdate(data, existingUserId) {
  if (data.doctorDetails.license) {
    data.doctorDetails.license = await handleBase64Upload(data.doctorDetails.license, randomBytes(16).toString('hex'));
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await UserModel.findOneAndUpdate({ _id: existingUserId }, data.userDetails, { session });
    const doctor = await DoctorModel.findOneAndUpdate({ user: existingUserId }, data.doctorDetails, {
      new: true,
      session,
    });
    if (doctor) {
      await TrialModel.updateMany({ conductedBy: doctor._id }, data.trialDetails, { session });
    } else {
      throw new HttpError({
        message: 'Doctor not found',
        statusCode: 404,
        name: 'NotFoundError',
      });
    }
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

/**
 * Handle donor acquirer update
 * @param {any} data
 * @param {string} existingUserId
 */
async function handleDonorAcquirerUpdate(data, existingUserId) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await UserModel.findOneAndUpdate({ _id: existingUserId }, data.userDetails, { session });
    await DonorAcquirerModel.findOneAndUpdate({ user: existingUserId }, data.donorAcquirerDetails, {
      new: true,
      session,
    });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
