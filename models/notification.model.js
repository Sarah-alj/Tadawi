import mongoose, { Schema } from 'mongoose';
const notificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    eventType: {
        type: String,
        enum: [
            'chat',
            'lab-appointment',
            'match-request',
            'match-accept',
            'match-reject',
        ],
        required: true,
    },
}, { timestamps: true });
export const NotificationModel = mongoose.model('Notification', notificationSchema);
