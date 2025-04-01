import OpenAI from 'openai';
import { z } from 'zod';
import fsPromises from 'fs/promises';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import HttpError from '../../lib/http-error.js';
import { getAbsolutePath } from '../../lib/utils.js';

const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;

const requestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      message: z.string(),
    })
  ),
});

const knowledgeBasePath = getAbsolutePath(['chatbot-knowledgebase.txt']);

/**
 * Controller for handling AI chat requests.
 * @type {import('../../types.js').RequestController}
 */
export async function postAIChat(request) {
  const requestBody = requestSchema.parse(request.body);

  const { messages } = requestBody;

  const openai = new OpenAI({
    apiKey: OPEN_AI_API_KEY,
  });

  const knowledgeBaseContent = await fsPromises.readFile(knowledgeBasePath, 'utf-8');

  const knowledgeBase = knowledgeBaseContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const knowledgeBasePrompt = `You are a helpful assistant. Here are some facts I know:\n${knowledgeBase.join('\n')}`;

  const chatHistory = messages.map((message) => `${message.role}: ${message.message}`).join('\n');
  const prompt = `${knowledgeBasePrompt}\n\n${chatHistory}\n\nAssistant:`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  });

  if (!response.choices || response.choices.length === 0) {
    throw new HttpError({
      statusCode: 500,
      message: 'No response from OpenAI API',
      name: 'InternalServerError',
    });
  }

  return new ApiSuccessResponse({
    data: {
      message: response.choices[0].message.content,
    },
  });
}
