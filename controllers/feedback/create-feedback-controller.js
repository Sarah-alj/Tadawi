import { z } from 'zod';

import { FeedbackModel } from '../../models/feedback.model.js';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { checkAuth } from '../../lib/check-auth.js';

const requestSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  comments: z.string().nonempty(),
});

/**
 * Create feedback controller
 * @type {import('../../types.js').RequestController}
 */
export async function createFeedbackController(request) {
  const authUser = await checkAuth(request, ['donorAcquirer', 'doctor', 'patient']);
  const currentUserId = authUser._id;

  const requestBody = requestSchema.parse(request.body);

  const feedback = new FeedbackModel({
    name: requestBody.name,
    email: requestBody.email,
    comments: requestBody.comments,
    user: currentUserId,
  });

  const newFeedback = await feedback.save();

  return new ApiSuccessResponse({
    message: 'Feedback created successfully',
    statusCode: 201,
    data: newFeedback,
  });
}
