import { Router } from 'express';

import { requestHandlerWrapper } from '../lib/app-request-handler.js';

import { createFeedbackController } from '../controllers/feedback/create-feedback-controller.js';

const router = Router();

router.post('/', requestHandlerWrapper(createFeedbackController));

export default router;
