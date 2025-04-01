import mongoose, { Schema } from 'mongoose';
const PatientMedicalHistorySchema = new Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    disease: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DiseaseType',
      required: true,
    },
    medicalHistory: { type: String },
    medicinalHistory: { type: String },
    familyHistory: { type: String },
    currentExperiencedSymptoms: { type: String },
  },
  { timestamps: true }
);
export const PatientMedicalHistoryModel = mongoose.model('PatientMedicalHistory', PatientMedicalHistorySchema);
