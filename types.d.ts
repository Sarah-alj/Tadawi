import { Request } from 'express';
import { ApiSuccessResponse } from './lib/api-response';
import 'express-session';

type RequestController = (request: Request) => Promise<ApiSuccessResponse>;

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}
