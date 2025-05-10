import { z } from 'zod';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import { AIChatService } from '../../services/ai-chat-service.js';

const requestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      message: z.string(),
    })
  ),
});

/**
 * Controller for handling AI chat requests.
 * @type {import('../../types.js').RequestController}
 */
export async function postAIChat(request) {
  const requestBody = requestSchema.parse(request.body);
  const { messages } = requestBody;

  const answer = await AIChatService.getInstance().getAnswer(messages);

  return new ApiSuccessResponse({
    data: {
      message: answer,
    },
  });
}
