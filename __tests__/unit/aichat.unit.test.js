import { jest } from '@jest/globals';
import { ApiSuccessResponse } from '../../lib/api-response.js';
import HttpError from '../../lib/http-error.js';

const mockReadFile = jest.fn();
const mockCreate = jest.fn();

// Mock fs/promises
jest.unstable_mockModule('fs/promises', () => ({
  default: {
    readFile: mockReadFile,
  },
}));

// Mock OpenAI class
jest.unstable_mockModule('openai', () => {
  return {
    default: class OpenAI {
      constructor() {}
      chat = {
        completions: {
          create: mockCreate,
        },
      };
    },
  };
});

// Import the module AFTER mocks are set up
const { postAIChat } = await import('../../controllers/ai/chat-controller.js');

describe('postAIChat', () => {
  beforeEach(() => {
    process.env.OPEN_AI_API_KEY = 'mock-api-key';
    jest.clearAllMocks();
  });

  it('returns a successful response from OpenAI', async () => {
    mockReadFile.mockResolvedValue('Lima is the capital of Peru.\nMachu Picchu is in Peru.');
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: 'Lima is the capital of Peru.' } }],
    });

    const req = {
      body: {
        messages: [{ role: 'user', message: 'What’s the capital of Peru?' }],
      },
    };

    const res = await postAIChat(req);

    expect(res).toBeInstanceOf(ApiSuccessResponse);
    expect(res.data.message).toBe('Lima is the capital of Peru.');
  });

  it('throws validation error for empty messages', async () => {
    const req = { body: { messages: [] } };

    await expect(postAIChat(req)).rejects.toThrow(/Messages array must contain at least one message/);
  });

  it('throws HttpError when OpenAI returns no choices', async () => {
    mockReadFile.mockResolvedValue('Peru facts...');
    mockCreate.mockResolvedValue({ choices: [] });

    const req = {
      body: { messages: [{ role: 'user', message: 'Tell me something' }] },
    };

    await expect(postAIChat(req)).rejects.toThrow(HttpError);
  });
});
