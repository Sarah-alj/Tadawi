import express from 'express';
import 'express-async-errors';
import request from 'supertest';
import mongoose from 'mongoose';

import AIChatRouter from '../../routes/ai-chat.routes.js';
import { connectDB } from '../../config/database.js';
import { getSessionMiddleware } from '../../middleware/session-middleware.js';

let app;

const baseRoute = '/api/ai-chat';

beforeAll(async () => {
  await connectDB();

  app = express();
  app.use(express.json());

  app.use(getSessionMiddleware());

  app.use(baseRoute, AIChatRouter);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /api/ai-chat', () => {
  const endpoint = `${baseRoute}/`;

  const postAIChat = async (data) => {
    return await request(app).post(endpoint).send(data);
  };

  it('should return a valid AI response for a valid chat request', async () => {
    const postData = {
      messages: [{ role: 'user', message: 'What are the lab timings?' }],
    };

    const res = await postAIChat(postData);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          message: expect.any(String),
        }),
      })
    );
  });

  it('should fail with invalid message schema', async () => {
    const postData = {
      messages: [{ role: 'invalid-role', message: 'What are the lab timings?' }],
    };

    const res = await postAIChat(postData);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      })
    );
  });

  it('should fail when messages array is empty', async () => {
    const postData = {
      messages: [],
    };

    const res = await postAIChat(postData);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      })
    );
  });

  it('should fail when no messages field is provided', async () => {
    const postData = {};

    const res = await postAIChat(postData);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      })
    );
  });

  it('should fail when message content is missing', async () => {
    const postData = {
      messages: [{ role: 'user' }],
    };

    const res = await postAIChat(postData);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      })
    );
  });

  it('should fail when role is missing in the message', async () => {
    const postData = {
      messages: [{ message: 'What are the lab timings?' }],
    };

    const res = await postAIChat(postData);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      })
    );
  });
});
