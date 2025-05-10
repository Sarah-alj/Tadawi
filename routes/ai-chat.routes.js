import { Router } from 'express';
import { requestHandlerWrapper } from '../lib/app-request-handler.js';
import { postAIChat } from '../controllers/ai/chat-controller.js';

const router = Router();

router.post('/', requestHandlerWrapper(postAIChat));

export default router;
