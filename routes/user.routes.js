import { Router } from 'express';
import { requestHandlerWrapper } from '../lib/app-request-handler.js';
import { getMyProfile } from '../controllers/user/get-my-profile.js';
import { updateMyProfile } from '../controllers/user/update-my-profile.js';
const router = Router();
router.get('/my-profile', requestHandlerWrapper(getMyProfile));
router.put('/my-profile/update', requestHandlerWrapper(updateMyProfile));
export default router;
