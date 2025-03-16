import { z } from 'zod';
import { DoctorModel } from '../../models/doctor.model.js';
import { MatchModel } from '../../models/match.model.js';
import { TrialModel } from '../../models/trial.model.js';
import { UserModel } from '../../models/user.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import HttpError from '../../lib/http-error.js';
const requestSchema = z.object({});
const requestHandler = async ({ request, }) => {
    const currentUserId = request.session.userId;
    if (!currentUserId) {
        throw new HttpError({
            statusCode: 401,
            name: 'Unauthorized',
            message: 'You need to be logged in to access this route',
        });
    }
    const myMatches = await MatchModel.find({
        $or: [{ user1: currentUserId }, { user2: currentUserId }],
    }).lean();
    const myMatchedUserIds = myMatches.map((match) => {
        if (match.user1.toString() === currentUserId) {
            return match.user2;
        }
        return match.user1;
    });
    const doctors = await UserModel.find({
        _id: { $nin: myMatchedUserIds },
        userType: 'doctor',
    }).lean();
    const doctorProfiles = [];
    for (const doctor of doctors) {
        const doctorProfile = await DoctorModel.findOne({
            user: doctor._id,
        }).lean();
        if (!doctorProfile)
            continue;
        const trial = await TrialModel.findOne({
            conductedBy: doctorProfile?._id,
        }).lean();
        if (!trial)
            continue;
        doctorProfiles.push({
            userId: doctor._id,
            name: doctor.name,
            specialization: doctorProfile?.specialization,
            riskLevel: trial?.riskLevel,
            duration: trial?.duration,
        });
    }
    return new ApiSuccessResponse({
        statusCode: 200,
        data: doctorProfiles,
        message: 'Patients fetched successfully',
    });
};
export const getAllDoctors = {
    requestSchema,
    requestHandler,
};
