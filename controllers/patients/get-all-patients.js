import { MatchModel } from '../../models/match.model.js';
import { PatientMedicalHistoryModel } from '../../models/medicalHistory.model.js';
import { PatientModel } from '../../models/patient.model.js';
import { UserModel } from '../../models/user.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';

/**
 * Get all patients that are not matched with the current user
 * @type {import('../../types.js').RequestController}
 */
export async function getAllPatients(request) {
  const authUser = await checkAuth(request, ['doctor']);
  const currentUserId = authUser._id.toString();

  const myMatches = await MatchModel.find({
    $or: [{ user1: currentUserId }, { user2: currentUserId }],
    status: { $ne: 'chat-only' },
  });

  const myMatchedUserIds = myMatches.map((match) => {
    if (match.user1.toString() === currentUserId) {
      return match.user2;
    }
    return match.user1;
  });

  const patients = await UserModel.find({
    _id: { $nin: myMatchedUserIds },
    userType: 'patient',
  });

  const patientsWithProfiles = [];

  const currentYear = new Date().getFullYear();

  for (const patient of patients) {
    const patientProfile = await PatientModel.findOne({
      user: patient._id,
    });

    if (!patientProfile) continue;

    const medicalHistory = await PatientMedicalHistoryModel.findOne({
      patient: patientProfile._id,
    }).populate('disease');

    if (!medicalHistory) continue;

    if (!medicalHistory.disease) continue;

    if (!('name' in medicalHistory.disease)) continue;
    if (!('type' in medicalHistory.disease)) continue;

    patientsWithProfiles.push({
      user: {
        _id: patient._id,
        gender: patient.gender,
        region: patient.region,
        age: currentYear - patient.dateOfBirth.getFullYear(),
        nationality: patient.nationality,
        name: patient.name,
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
    });
  }

  return new ApiSuccessResponse({
    statusCode: 200,
    data: patientsWithProfiles,
    message: 'Patients fetched successfully',
  });
}
