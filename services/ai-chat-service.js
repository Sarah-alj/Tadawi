import OpenAI from 'openai';
import fsPromises from 'fs/promises';

import HttpError from '../lib/http-error.js';
import { getAbsolutePath } from '../lib/utils.js';

const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;
const knowledgeBasePath = getAbsolutePath(['chatbot-knowledgebase.txt']);

export class AIChatService {
  /**
   * @type {AIChatService}
   */
  static instance;

  constructor() {
    if (AIChatService.instance) {
      return AIChatService.instance;
    }
    this.openai = new OpenAI({ apiKey: OPEN_AI_API_KEY });
    this.knowledgeBase = null;
    AIChatService.instance = this;
  }

  static getInstance() {
    if (!AIChatService.instance) {
      AIChatService.instance = new AIChatService();
    }
    return AIChatService.instance;
  }

  async loadKnowledgeBase() {
    if (!this.knowledgeBase) {
      const content = await fsPromises.readFile(knowledgeBasePath, 'utf-8');
      this.knowledgeBase = content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    }
    return this.knowledgeBase;
  }

  /**
   * Get an answer from OpenAI based on the provided messages and knowledge base.
   * @param {Array<{ role: string, message: string }>} messages - The chat history.
   * @returns {Promise<string>} - The generated answer from OpenAI.
   */
  async getAnswer(messages) {
    const knowledgeBase = await this.loadKnowledgeBase();
    const knowledgeBasePrompt = `You are a helpful assistant. Here are some facts I know:\n${knowledgeBase.join('\n')}`;
    const chatHistory = messages.map((message) => `${message.role}: ${message.message}`).join('\n');
    const prompt = `${knowledgeBasePrompt}\n\n${chatHistory}\n\nAssistant:`;

    // @ts-ignore
    const response = await this.openai.chat.completions.create({
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

    return response.choices[0].message.content ?? 'Failed to get a response from OpenAI.';
  }
}
