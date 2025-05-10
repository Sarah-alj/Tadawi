import mongoose, { Schema } from 'mongoose';
import { MatchModel } from './match.model.js';
import { UserModel } from './user.model.js';
import { DoctorModel } from './doctor.model.js';
import { TrialModel } from './trial.model.js';

const PatientSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    allergies: { type: String, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    lifestyle: { type: String, required: true },
    idVerification: { type: String },
    emergencyContact: {
      name: { type: String, required: true },
      relation: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
  },
  {
    timestamps: true,

    //* INSTANCE METHODS
    methods: {
      /**
       * Get matches as patient
       * @returns {Promise<Array<any>>} - Array of match profiles
       */
      async getMyMatches() {
        const currentYear = new Date().getFullYear();
        const currentUserId = this.user.toString();

        const matches = await MatchModel.find({
          $or: [{ user1: currentUserId }, { user2: currentUserId }],
          status: { $ne: 'chat-only' },
        });

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
      },
    },
  }
);

export const PatientModel = mongoose.model('Patient', PatientSchema);
