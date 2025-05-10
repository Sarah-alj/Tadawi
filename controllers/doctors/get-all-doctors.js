import { DoctorModel } from '../../models/doctor.model.js';
import { MatchModel } from '../../models/match.model.js';
import { TrialModel } from '../../models/trial.model.js';
import { UserModel } from '../../models/user.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';

/**
 * Get all doctors
 * @type {import('../../types.js').RequestController}
 */
export async function getAllDoctors(request) {
  const authUser = await checkAuth(request, ['patient']);
  const currentUserId = authUser._id.toString();

  const currentYear = new Date().getFullYear();

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

  const doctors = await UserModel.find({
    _id: { $nin: myMatchedUserIds },
    userType: 'doctor',
  });

  const doctorProfiles = [];

  for (const doctor of doctors) {
    const doctorProfile = await DoctorModel.findOne({
      user: doctor._id,
    });

    if (!doctorProfile) continue;

    const trial = await TrialModel.findOne({
      conductedBy: doctorProfile?._id,
    });

    if (!trial) continue;

    doctorProfiles.push({
      user: {
        _id: doctor._id,
        gender: doctor.gender,
        region: doctor.region,
        age: currentYear - doctor.dateOfBirth.getFullYear(),
        nationality: doctor.nationality,
        name: doctor.name,
      },
      profile: {
        specialization: doctorProfile.specialization,
        institute: doctorProfile.institute,
        pointOfContact: doctorProfile.pointOfContact,
      },
      trial: {
        trialDescription: trial.trialDescription,
        trialRequirements: trial.trialRequirements,
        duration: trial.duration,
        riskLevel: trial.riskLevel,
      },
    });
  }

  return new ApiSuccessResponse({
    statusCode: 200,
    data: doctorProfiles,
    message: 'Doctors fetched successfully',
  });
}
