import mongoose, { Schema } from 'mongoose';
const matchSchema = new Schema({
    user1: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    user2: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
        required: true,
    },
    rejectReason: {
        type: String,
    },
}, {
    timestamps: true,
});
export const MatchModel = mongoose.model('Match', matchSchema);
