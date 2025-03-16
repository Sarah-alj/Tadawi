import mongoose, { Schema } from 'mongoose';
const LabSchema = new Schema({
    labName: { type: String, required: true },
    testType: { type: String, required: true },
    bookingDateTime: { type: Date, required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
export const LabModel = mongoose.model('Lab', LabSchema);
