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
import { handleBase64Upload } from '../../lib/file-upload.js';
import HttpError from '../../lib/http-error.js';
import { requestSchema } from './signup-validation.js';
import { z } from 'zod';
import { NotificationModel } from '../../models/notification.model.js';

/**
 * Signup controller
 * @type {import('../../types.js').RequestController}
 */
export async function signupController(request) {
  const requestBody = requestSchema.parse(request.body);

  const existingUser = await UserModel.findOne({
    email: requestBody.userDetails.email,
  });
  if (existingUser) {
    throw new HttpError({
      message: 'Email already exists',
      statusCode: 409,
      name: 'ConflictError',
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(requestBody.userDetails.password, 10);
  requestBody.userDetails.password = hashedPassword;

  let user = null;
  if (requestBody.userType === 'patient') {
    user = await handlePatientCreate(requestBody);
  } else if (requestBody.userType === 'doctor') {
    user = await handleDoctorCreate(requestBody);
  } else if (requestBody.userType === 'donorAcquirer') {
    user = await handleDonorAcquirerCreate(requestBody);
  } else {
    throw new HttpError({
      message: 'Invalid user type',
      statusCode: 400,
      name: 'BadRequestError',
    });
  }

  if (user) {
    // create session for this user.
    request.session.userId = user._id.toString();

    const { password, ...userDetails } = user.toObject();

    if (requestBody.userType === 'patient') {
      postPatientRegisteration({ userId: user._id.toString(), patientData: requestBody });
    } else if (requestBody.userType === 'doctor') {
      postDoctorRegisteration({ userId: user._id.toString(), doctorData: requestBody });
    }

    return new ApiSuccessResponse({
      message: 'User registered successfully',
      data: {
        user: userDetails,
      },
      statusCode: 201,
    });
  }

  throw new HttpError({
    message: 'User registration failed',
    statusCode: 500,
    name: 'InternalServerError',
  });
}

/**
 * Handle patient creation
 * @param {z.infer<typeof requestSchema> & {userType: "patient"}} data
 */
async function handlePatientCreate(data) {
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
    const user = await new UserModel({
      ...data.userDetails,
      userType: 'patient',
    }).save({ session });
    const patient = await new PatientModel({
      ...data.patientDetails,
      user: user._id,
    }).save({ session });
    await new PatientMedicalHistoryModel({
      ...data.medicalHistory,
      patient: patient._id,
      disease: disease,
    }).save({ session });
    await session.commitTransaction();
    return user;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}

/**
 * Handle doctor creation
 * @param {z.infer<typeof requestSchema> & {userType: "doctor"}} data
 */
async function handleDoctorCreate(data) {
  data.doctorDetails.license = await handleBase64Upload(data.doctorDetails.license, randomBytes(16).toString('hex'));
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const user = await new UserModel({
      ...data.userDetails,
      userType: 'doctor',
    }).save({ session });
    const doctor = await new DoctorModel({
      ...data.doctorDetails,
      user: user._id,
    }).save({ session });
    await new TrialModel({
      ...data.trialDetails,
      conductedBy: doctor._id,
    }).save({ session });
    await session.commitTransaction();
    return user;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

/**
 * Handle donor acquirer creation
 * @param {z.infer<typeof requestSchema> & {userType: "donorAcquirer"}} data
 */
async function handleDonorAcquirerCreate(data) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const user = await new UserModel({
      ...data.userDetails,
      userType: 'donorAcquirer',
    }).save({ session });
    await new DonorAcquirerModel({
      ...data.donorAcquirerDetails,
      user: user._id,
    }).save({ session });
    await session.commitTransaction();
    return user;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

/**
 * Handle Post Patient Registration
 * @typedef {z.infer<typeof requestSchema> & {userType: "patient"}} PatientData
 * @typedef {{userId: string, name: string, specialization: string}} DoctorProfile
 * @param {{userId: string, patientData: PatientData}} data
 * @returns {Promise<void>}
 */
async function postPatientRegisteration({ userId, patientData }) {
  try {
    const doctorUsers = await UserModel.find({ userType: 'doctor' }).select('_id name');

    const disease = await DiseaseTypeModel.findById(patientData.medicalHistory.diseaseId);
    if (!disease) {
      throw new HttpError({
        message: 'Disease not found',
        statusCode: 404,
        name: 'NotFoundError',
      });
    }

    /** @type {DoctorProfile[]} */
    const doctorProfiles = [];
    await Promise.all(
      doctorUsers.map(async (doctorUser) => {
        const doctor = await DoctorModel.findOne({ user: doctorUser._id }).select('specialization');
        if (!doctor) return;

        doctorProfiles.push({
          userId: doctorUser._id.toString(),
          name: doctorUser.name,
          specialization: doctor.specialization,
        });
      })
    );

    const diseaseNameNormalized = disease.name.toLowerCase();
    const diseaseTypeNormalized = disease.type.toLowerCase();

    const matchedDoctors = doctorProfiles.filter((doctor) => {
      const doctorSpecializationNormalized = doctor.specialization.toLowerCase();
      return (
        doctorSpecializationNormalized.includes(diseaseNameNormalized) ||
        doctorSpecializationNormalized.includes(diseaseTypeNormalized) ||
        diseaseNameNormalized.includes(doctorSpecializationNormalized) ||
        diseaseTypeNormalized.includes(doctorSpecializationNormalized)
      );
    });

    console.log('Matched doctors:', matchedDoctors);
    console.log(doctorProfiles);
    console.log('Patient disease:', diseaseNameNormalized, diseaseTypeNormalized);

    // send notification to doctors for matched patient
    const meaningfulMessage = `New potential trial match: Patient ${patientData.userDetails.name} with ${disease.name} (${disease.type}). Medical History: ${patientData.medicalHistory.medicalHistory}. Medicinal History: ${patientData.medicalHistory.medicinalHistory}`;
    await NotificationModel.create(
      matchedDoctors.map((doctor) => ({
        user: doctor.userId,
        message: meaningfulMessage,
        eventType: 'automatch',
      }))
    );

    // send notification to patient for matched doctors
    const notifications = matchedDoctors.map((doctor) => ({
      user: userId,
      message: `Doctor ${doctor.name} with specialization ${doctor.specialization} may be a potential match for your case.`,
      eventType: 'automatch',
    }));

    await NotificationModel.create(notifications);
    console.log('Patient registration successful. Notifications sent to doctors and patient.');
  } catch (error) {
    console.log('Fail post patient registration', error);
  }
}

/**
 * Handle Post Doctor Registration
 * @typedef {z.infer<typeof requestSchema> & {userType: "doctor"}} DoctorData
 * @typedef {{userId: string, name: string, diseaseName: string, diseaseType: string, medicalHistory: string | null | undefined, medicinalHistory: string | null | undefined}} PatientProfile
 * @param {{userId: string, doctorData: DoctorData}} data
 * @returns {Promise<void>}
 */
async function postDoctorRegisteration({ userId, doctorData }) {
  try {
    // TODO: Implement logic to match patients with doctors based on their specialization and medical history
    const patientUsers = await UserModel.find({ userType: 'patient' }).select('_id name');

    /** @type {PatientProfile[]} */
    const patientProfiles = [];

    await Promise.all(
      patientUsers.map(async (patientUser) => {
        const patient = await PatientModel.findOne({ user: patientUser._id }).select('_id');
        if (!patient) return;

        const medicalHistory = await PatientMedicalHistoryModel.findOne({ patient: patient._id }).select(
          'disease medicalHistory medicinalHistory'
        );
        if (!medicalHistory) return;

        const disease = await DiseaseTypeModel.findById(medicalHistory.disease).select('name type');
        if (!disease) return;

        patientProfiles.push({
          userId: patientUser._id.toString(),
          name: patientUser.name,
          diseaseName: disease.name,
          diseaseType: disease.type,
          medicalHistory: medicalHistory.medicalHistory,
          medicinalHistory: medicalHistory.medicinalHistory,
        });
      })
    );

    const specializationNormalized = doctorData.doctorDetails.specialization.toLowerCase();

    const matchedPatients = patientProfiles.filter((patient) => {
      const diseaseNameNormalized = patient.diseaseName.toLowerCase();
      const diseaseTypeNormalized = patient.diseaseType.toLowerCase();
      return (
        specializationNormalized.includes(diseaseNameNormalized) ||
        specializationNormalized.includes(diseaseTypeNormalized) ||
        diseaseNameNormalized.includes(specializationNormalized) ||
        diseaseTypeNormalized.includes(specializationNormalized)
      );
    });

    // send notification to patients for matched doctor
    const meaningfulMessage = `New potential trial match: Doctor ${doctorData.userDetails.name} with specialization ${doctorData.doctorDetails.specialization}.`;
    await NotificationModel.create(
      matchedPatients.map((patient) => ({
        user: patient.userId,
        message: meaningfulMessage,
        eventType: 'automatch',
      }))
    );
    // send notification to doctor for matched patients
    const notifications = matchedPatients.map((patient) => ({
      user: userId,
      message: `Potential trial match found: Patient ${patient.name} with ${patient.diseaseName} (${
        patient.diseaseType
      }). ${patient.medicalHistory ? `Medical History: ${patient.medicalHistory}.` : ''} ${
        patient.medicinalHistory ? `Medicinal History: ${patient.medicinalHistory}` : ''
      }`.trim(),
      eventType: 'automatch',
      metadata: {
        patientId: patient.userId,
        diseaseName: patient.diseaseName,
        diseaseType: patient.diseaseType,
      },
    }));
    await NotificationModel.create(notifications);
    console.log('Doctor registration successful. Notifications sent to patients and doctor.');
  } catch (error) {
    console.log('Fail post doctor registration', error);
  }
}
