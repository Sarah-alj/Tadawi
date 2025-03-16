import { NotificationModel, } from '../models/notification.model.js';
import { UserModel } from '../models/user.model.js';
const MESSAGES = {
    chat: (name) => `You have a new message from ${name}`,
    'lab-appointment': (name) => `Your lab appointment has been scheduled by ${name}`,
    'match-request': (name) => `You have a new match request from ${name}`,
    'match-accept': (name) => `Your match request has been accepted by ${name}`,
    'match-reject': (name) => `Your match request has been rejected by ${name}`,
};
export function createNotification({ userId, senderId, eventType, }) {
    UserModel.findById(senderId)
        .select('name')
        .then((sender) => {
        if (!sender)
            return;
        NotificationModel.create({
            user: userId,
            message: MESSAGES[eventType](sender.name),
            eventType: eventType,
        }).catch((error) => {
            console.error('⚠️ Error creating notification:', error);
        });
    });
}
