import { NotificationModel } from '../models/notification.model.js';
import { UserModel } from '../models/user.model.js';
import { LabModel } from '../models/lab.model.js';
import { DonationModel } from '../models/donation.model.js';

/**
 * @typedef {"lab-appointment" | "match-request" | "match-accept" | "match-reject" | "chat" | "profile-updated" | "donation-updated" | "donation-acquired" | "donation-deleted" } EventType
 */

/**
 * @param {Object} param
 * @param {string} param.receiverId
 * @param {string} param.senderId
 * @param {EventType} param.eventType
 * @param {string} [param.relatedId]
 *
 */
export async function createNotification({ receiverId, senderId, eventType, relatedId }) {
  try {
    const sender = await UserModel.findById(senderId).select('name userType');
    if (!sender) return;

    const receiver = await UserModel.findById(receiverId).select('name userType');
    if (!receiver) return;

    switch (eventType) {
      case 'lab-appointment': {
        const lab = await LabModel.findById(relatedId);
        if (!lab) return;

        const messageForDoctor = `You have scheduled a lab appointment for ${receiver.name} at ${lab.labName} on <time datetime="${lab.bookingDateTime}"></time>`;

        const messageForPatient = `Your lab appointment has been scheduled by ${sender.name} at ${lab.labName} on <time datetime="${lab.bookingDateTime}"></time>`;

        await NotificationModel.create([
          {
            user: senderId,
            message: messageForDoctor,
            eventType: eventType,
          },
          {
            user: receiverId,
            message: messageForPatient,
            eventType: eventType,
          },
        ]);
        break;
      }
      case 'match-request': {
        const message = `You have a new match request from ${sender.name}`;
        await NotificationModel.create({
          user: receiverId,
          message,
          eventType,
        });
        break;
      }
      case 'match-accept': {
        const message = `Your match request has been accepted by ${sender.name}`;
        await NotificationModel.create({
          user: receiverId,
          message,
          eventType,
        });
        break;
      }
      case 'match-reject': {
        const message = `Your match request has been rejected by ${sender.name}`;
        await NotificationModel.create({
          user: receiverId,
          message,
          eventType,
        });
        break;
      }
      case 'donation-updated': {
        const message = `Your donation details have been successfully updated.`;
        await NotificationModel.create({
          user: receiverId,
          message,
          eventType,
        });
        break;
      }
      case 'donation-deleted': {
        const message = `Your donation has been successfully deleted from the system.`;
        await NotificationModel.create({
          user: receiverId,
          message,
          eventType,
        });
        break;
      }
      case 'donation-acquired': {
        const donation = await DonationModel.findById(relatedId);
        if (!donation) return;

        const equipmentName = donation.equipmentName;
        const donorName = receiver.name;
        const acquirerName = sender.name;

        const messageForDonor = `Your donation of ${equipmentName} has been acquired by ${acquirerName}`;
        const messageForAcquirer = `You have acquired ${equipmentName} from ${donorName}`;

        await NotificationModel.create([
          {
            user: receiverId,
            message: messageForDonor,
            eventType: eventType,
          },
          {
            user: senderId,
            message: messageForAcquirer,
            eventType: eventType,
          },
        ]);
      }
      case 'profile-updated': {
        const message = `Your profile has been successfully updated.`;
        await NotificationModel.create({
          user: receiverId,
          message,
          eventType,
        });
        break;
      }
    }
  } catch (error) {
    console.error('⚠️ Error creating notification:', error);
  }
}
/*
no the automatic match suggestion notification should just show the details of the clinical trial/patient that the system thinks is a match(so it should show the name, details of the clinical trial/patient details) so that the user can just use the filters to sort through and find the clinical trial/patient that the system has recommended(the system shall match only if the disease and some of the patient requirements match)
*/
