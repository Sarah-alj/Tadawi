import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female'] },
    region: { type: String, required: true },
    dateOfBirth: { type: Date },
    phoneNumber: { type: String, required: true },
    title: { type: String, required: true },
    nationality: { type: String, required: true },
    otp: { type: String },
    userType: {
        type: String,
        enum: ['patient', 'doctor', 'donorAcquirer'],
        required: true,
    },
}, { timestamps: true });
export const UserModel = mongoose.model('User', UserSchema);
