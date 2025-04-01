import { z } from 'zod';
import { DoctorModel } from '../../models/doctor.model.js';
import { DonorAcquirerModel } from '../../models/donor.model.js';
import { PatientMedicalHistoryModel } from '../../models/medicalHistory.model.js';
import { PatientModel } from '../../models/patient.model.js';
import { TrialModel } from '../../models/trial.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
import HttpError from '../../lib/http-error.js';

/**
 * Get my profile
 * @type {import('../../types.js').RequestController}
 */
export async function getMyProfile(request) {
  const authUser = await checkAuth(request, ['doctor', 'patient', 'donorAcquirer']);
  if (authUser.userType === 'doctor') {
    const doctorProfile = await DoctorModel.findOne({
      user: authUser._id,
    }).lean();
    if (!doctorProfile) {
      throw new HttpError({
        message: 'Doctor profile not found',
        statusCode: 404,
        name: 'NotFound',
      });
    }
    const doctorTrials = await TrialModel.findOne({
      conductedBy: doctorProfile._id,
    }).lean();
    return new ApiSuccessResponse({
      data: {
        user: authUser,
        doctorProfile,
        doctorTrials,
      },
    });
  }
  if (authUser.userType === 'donorAcquirer') {
    const donorAcquirerProfile = await DonorAcquirerModel.findOne({
      user: authUser._id,
    }).lean();
    if (!donorAcquirerProfile) {
      throw new HttpError({
        message: 'Donor/Acquirer profile not found',
        statusCode: 404,
        name: 'NotFound',
      });
    }
    return new ApiSuccessResponse({
      data: {
        user: authUser,
        donorAcquirerProfile,
      },
    });
  }
  if (authUser.userType === 'patient') {
    const patientProfile = await PatientModel.findOne({
      user: authUser._id,
    }).lean();
    if (!patientProfile) {
      throw new HttpError({
        message: 'Patient profile not found',
        statusCode: 404,
        name: 'NotFound',
      });
    }
    const medicalHistory = await PatientMedicalHistoryModel.findOne({
      patient: patientProfile._id,
    }).lean();
    return new ApiSuccessResponse({
      data: {
        user: authUser,
        patientProfile,
        medicalHistory,
      },
    });
  }
  throw new HttpError({
    message: 'User type not supported',
    statusCode: 400,
    name: 'BadRequest',
  });
}
