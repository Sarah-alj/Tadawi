import mongoose, { Schema } from 'mongoose';
const DoctorSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: { type: String, required: true },
    license: { type: String, required: true, unique: true },
    institute: { type: String, required: true },
    pointOfContact: { type: String, required: true },
}, { timestamps: true });
export const DoctorModel = mongoose.model('Doctor', DoctorSchema);
