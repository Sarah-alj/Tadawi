import { DoctorModel } from '../../models/doctor.model.js';
import { MatchModel } from '../../models/match.model.js';
import { PatientMedicalHistoryModel } from '../../models/medicalHistory.model.js';
import { PatientModel } from '../../models/patient.model.js';
import { TrialModel } from '../../models/trial.model.js';
import { UserModel } from '../../models/user.model.js';
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
    const doctorMatches = await getMatchesAsDoctor(currentUserId);
    return new ApiSuccessResponse({
      data: doctorMatches,
      statusCode: 200,
      message: 'All matches fetched successfully',
    });
  }

  if (authUser.userType === 'patient') {
    const patientMatches = await getMatchesAsPatient(currentUserId);
    return new ApiSuccessResponse({
      data: patientMatches,
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

/**
 * Get matches as doctor
 * @param {string} currentUserId
 */
async function getMatchesAsDoctor(currentUserId) {
  const currentYear = new Date().getFullYear();
  // Get all matches where user is either user1 or user2
  const matches = await MatchModel.find({
    $or: [{ user1: currentUserId }, { user2: currentUserId }],
  });

  const matchProfiles = await Promise.all(
    matches.map(async (match) => {
      const otherUserId = match.user1.toString() === currentUserId ? match.user2 : match.user1;

      const [user, patientProfile] = await Promise.all([
        UserModel.findById(otherUserId),
        PatientModel.findOne({ user: otherUserId }),
      ]);

      if (!user || !patientProfile) return null;

      const medicalHistory = await PatientMedicalHistoryModel.findOne({
        patient: patientProfile._id,
      }).populate('disease');

      if (!medicalHistory) return null;
      if (!('name' in medicalHistory.disease)) return null;
      if (!('type' in medicalHistory.disease)) return null;

      return {
        matchId: match._id,
        sentByMe: match.user1.toString() === currentUserId,
        status: match.status,

        user: {
          _id: user._id,
          gender: user.gender,
          region: user.region,
          age: currentYear - user.dateOfBirth.getFullYear(),
          nationality: user.nationality,
          name: user.name,
        },
        profile: {
          allergies: patientProfile.allergies,
          height: patientProfile.height,
          weight: patientProfile.weight,
          lifestyle: patientProfile.lifestyle,
        },
        medicalHistory: {
          medicalHistory: medicalHistory.medicalHistory,
          medicinalHistory: medicalHistory.medicinalHistory,
          familyHistory: medicalHistory.familyHistory,
          currentExperiencedSymptoms: medicalHistory.currentExperiencedSymptoms,

          disease: {
            name: medicalHistory.disease.name,
            type: medicalHistory.disease.type,
          },
        },
      };
    })
  );
  const validProfiles = matchProfiles.filter((profile) => profile !== null);
  return validProfiles;
}

/**
 * Get matches as patient
 * @param {string} currentUserId
 */
async function getMatchesAsPatient(currentUserId) {
  // Get all matches where user is either user1 or user2
  const matches = await MatchModel.find({
    $or: [{ user1: currentUserId }, { user2: currentUserId }],
  });

  const currentYear = new Date().getFullYear();

  const matchProfiles = await Promise.all(
    matches.map(async (match) => {
      const otherUserId = match.user1.toString() === currentUserId ? match.user2 : match.user1;
      const [user, doctorProfile] = await Promise.all([
        UserModel.findById(otherUserId),
        DoctorModel.findOne({ user: otherUserId }),
      ]);

      if (!user || !doctorProfile) return null;

      const trialData = await TrialModel.findOne({
        conductedBy: doctorProfile._id,
      });

      if (!trialData) return null;

      return {
        matchId: match._id,
        sentByMe: match.user1.toString() === currentUserId,
        status: match.status,

        user: {
          _id: user._id,
          gender: user.gender,
          region: user.region,
          age: currentYear - user.dateOfBirth.getFullYear(),
          nationality: user.nationality,
          name: user.name,
        },
        profile: {
          specialization: doctorProfile.specialization,
          institute: doctorProfile.institute,
          pointOfContact: doctorProfile.pointOfContact,
        },
        trial: {
          trialDescription: trialData.trialDescription,
          trialRequirements: trialData.trialRequirements,
          duration: trialData.duration,
          riskLevel: trialData.riskLevel,
        },
      };
    })
  );
  const validProfiles = matchProfiles.filter((profile) => profile !== null);
  return validProfiles;
}
