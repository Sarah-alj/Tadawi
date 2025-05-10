import mongoose, { Schema } from 'mongoose';
import { MatchModel } from './match.model.js';
import { UserModel } from './user.model.js';
import { PatientModel } from './patient.model.js';
import { PatientMedicalHistoryModel } from './medicalHistory.model.js';
import { LabModel } from './lab.model.js';

const DoctorSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: { type: String, required: true },
    license: { type: String, required: true, unique: true },
    institute: { type: String, required: true },
    pointOfContact: { type: String, required: true },
  },
  {
    timestamps: true,

    //* INSTANCE METHODS
    methods: {
      //* BOOK A LAB
      async bookLab(data) {
        return LabModel.create({
          labName: data.labName,
          testType: data.testType,
          bookingDateTime: new Date(data.appointmentDateTime),
          patient: data.patientId,
          doctor: this.user,
        });
      },

      //* VIEW MY LAB BOOKINGS
      async getMyLabBookings() {
        const labBookings = await LabModel.find({ doctor: this.user }).populate('patient', 'name');

        return labBookings;
      },

      /**
       * Get matches as doctor
       * @returns {Promise<Array<any>>} - Array of match profiles
       */
      async getMyMatches() {
        const currentUserId = this.user.toString();
        const currentYear = new Date().getFullYear();

        // Get all matches where user is either user1 or user2
        const matches = await MatchModel.find({
          $or: [{ user1: currentUserId }, { user2: currentUserId }],
          status: { $ne: 'chat-only' },
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

        return matchProfiles.filter((matchProfile) => matchProfile !== null);
      },
    },
  }
);
export const DoctorModel = mongoose.model('Doctor', DoctorSchema);
