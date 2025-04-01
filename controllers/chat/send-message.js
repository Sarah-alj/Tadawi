import { z } from 'zod';
import { MessageModel } from '../../models/message.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';
import { createNotification } from '../../lib/create-notification.js';
import { handleBase64Upload } from '../../lib/file-upload.js';
import { randomBytes } from 'crypto';

const baseSchema = z.object({
  recipient: z.string().nonempty(),
  matchId: z.string().nonempty(),
});

const requestSchema = z.discriminatedUnion('type', [
  baseSchema.merge(
    z.object({
      type: z.literal('text'),
      content: z.string().nonempty(),
    })
  ),
  baseSchema.merge(
    z.object({
      type: z.literal('image'),
      document: z.string().nonempty(),
    })
  ),
  baseSchema.merge(
    z.object({
      type: z.literal('pdf'),
      document: z.string().nonempty(),
    })
  ),
]);

/**
 * Send message
 * @type {import('../../types.js').RequestController}
 */
export async function sendMessage(request) {
  const authUser = await checkAuth(request, ['doctor', 'patient']);

  const currentUserId = authUser.id;

  const requestBody = requestSchema.parse(request.body);

  if (requestBody.type === 'image' || requestBody.type === 'pdf') {
    requestBody.document = await handleBase64Upload(requestBody.document, randomBytes(16).toString('hex'));
  }

  const message = new MessageModel({
    sender: currentUserId,
    ...requestBody,
  });
  await message.save();

  createNotification({
    eventType: 'chat',
    senderId: currentUserId,
    receiverId: requestBody.recipient,
    relatedId: message._id.toString(),
  });

  return new ApiSuccessResponse({
    data: {
      content: message.content,
      sender: message.sender,
    },
  });
}
