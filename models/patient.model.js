import mongoose, { Schema } from 'mongoose';
const PatientSchema = new Schema({
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
}, { timestamps: true });
export const PatientModel = mongoose.model('Patient', PatientSchema);
