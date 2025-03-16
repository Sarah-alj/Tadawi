import mongoose, { Schema } from 'mongoose';
const MessageSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true,
    },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
}, { timestamps: true });
export const MessageModel = mongoose.model('Message', MessageSchema);
