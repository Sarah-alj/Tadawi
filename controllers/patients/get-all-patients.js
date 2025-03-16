import { z } from 'zod';
import { MatchModel } from '../../models/match.model.js';
import { PatientMedicalHistoryModel } from '../../models/medicalHistory.model.js';
import { PatientModel } from '../../models/patient.model.js';
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
    const patients = await UserModel.find({
        _id: { $nin: myMatchedUserIds },
        userType: 'patient',
    }).lean();
    const patientsWithProfiles = [];
    const currentYear = new Date().getFullYear();
    for (const patient of patients) {
        const patientProfile = await PatientModel.findOne({
            user: patient._id,
        }).lean();
        if (!patientProfile)
            continue;
        const medicalHistory = await PatientMedicalHistoryModel.findOne({
            patient: patientProfile._id,
        })
            .populate('disease')
            .lean();
        if (!medicalHistory)
            continue;
        if (!('name' in medicalHistory.disease))
            continue;
        patientsWithProfiles.push({
            user: {
                _id: patient._id,
                name: patient.name,
                age: currentYear - patient.dateOfBirth.getFullYear(),
                region: patient.region,
                gender: patient.gender,
            },
            profile: {
                allergies: patientProfile.allergies,
                lifestyle: patientProfile.lifestyle,
            },
            medicalHistory: {
                medicalHistory: medicalHistory.medicalHistory,
                disease: medicalHistory.disease.name,
            },
        });
    }
    return new ApiSuccessResponse({
        statusCode: 200,
        data: patientsWithProfiles,
        message: 'Patients fetched successfully',
    });
};
export const getAllPatients = {
    requestSchema,
    requestHandler,
};
