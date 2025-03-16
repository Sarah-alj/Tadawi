import mongoose, { Schema } from 'mongoose';
const TrialSchema = new Schema({
    conductedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    trialDescription: { type: String, required: true },
    trialRequirements: { type: String, required: true },
    duration: { type: Number, required: true },
    riskLevel: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high'],
    },
}, { timestamps: true });
export const TrialModel = mongoose.model('Trial', TrialSchema);
