import { z } from 'zod';
import { DoctorModel } from '../../models/doctor.model.js';
import { MatchModel } from '../../models/match.model.js';
import { PatientMedicalHistoryModel } from '../../models/medicalHistory.model.js';
import { PatientModel } from '../../models/patient.model.js';
import { TrialModel } from '../../models/trial.model.js';
import { UserModel } from '../../models/user.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import HttpError from '../../lib/http-error.js';
const requestSchema = z.object({});
const requestHandler = async ({ request }) => {
    const currentUserId = request.session.userId;
    if (!currentUserId) {
        throw new HttpError({
            name: 'Unauthorized',
            message: 'You are not authorized to access this resource',
            statusCode: 401,
        });
    }
    const myUser = await UserModel.findById(currentUserId).lean();
    if (!myUser) {
        throw new HttpError({
            name: 'Unauthorized',
            message: 'You are not authorized to access this resource',
            statusCode: 401,
        });
    }
    if (myUser.userType === 'doctor') {
        const doctorMatches = await getMatchesAsDoctor(currentUserId);
        return new ApiSuccessResponse({
            data: doctorMatches,
            statusCode: 200,
            message: 'All matches fetched successfully',
        });
    }
    if (myUser.userType === 'patient') {
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
};
export const getMyMatchesController = { requestSchema, requestHandler };
// Helper function to get matches as doctor
async function getMatchesAsDoctor(currentUserId) {
    const currentYear = new Date().getFullYear();
    // Get all matches where user is either user1 or user2
    const matches = await MatchModel.find({
        $or: [{ user1: currentUserId }, { user2: currentUserId }],
    }).lean();
    const matchProfiles = await Promise.all(matches.map(async (match) => {
        const otherUserId = match.user1.toString() === currentUserId ? match.user2 : match.user1;
        const [user, patientProfile] = await Promise.all([
            UserModel.findById(otherUserId).lean(),
            PatientModel.findOne({ user: otherUserId }).lean(),
        ]);
        if (!user || !patientProfile)
            return null;
        const medicalHistory = await PatientMedicalHistoryModel.findOne({
            patient: patientProfile._id,
        })
            .populate({
            path: 'disease',
            select: 'name',
        })
            .lean();
        if (!medicalHistory)
            return null;
        return {
            matchId: match._id,
            sentByMe: match.user1.toString() === currentUserId,
            status: match.status,
            profile: {
                name: user.name,
                age: currentYear - new Date(user.dateOfBirth).getFullYear(),
                disease: medicalHistory.disease.name,
                region: user.region,
            },
        };
    }));
    const validProfiles = matchProfiles.filter((profile) => profile !== null);
    return validProfiles;
}
// Helper function to get matches as patient
async function getMatchesAsPatient(currentUserId) {
    // Get all matches where user is either user1 or user2
    const matches = await MatchModel.find({
        $or: [{ user1: currentUserId }, { user2: currentUserId }],
    }).lean();
    console.log('matches', matches);
    const matchProfiles = await Promise.all(matches.map(async (match) => {
        const otherUserId = match.user1.toString() === currentUserId ? match.user2 : match.user1;
        const [user, doctorProfile] = await Promise.all([
            UserModel.findById(otherUserId).lean(),
            DoctorModel.findOne({ user: otherUserId }).lean(),
        ]);
        if (!user || !doctorProfile)
            return null;
        const trialData = await TrialModel.findOne({
            conductedBy: doctorProfile._id,
        }).lean();
        if (!trialData)
            return null;
        return {
            matchId: match._id,
            sentByMe: match.user1.toString() === currentUserId,
            status: match.status,
            profile: {
                name: user.name,
                duration: trialData.duration,
                specialization: doctorProfile.specialization,
                riskLevel: trialData.riskLevel,
            },
        };
    }));
    const validProfiles = matchProfiles.filter((profile) => profile !== null);
    return validProfiles;
}
