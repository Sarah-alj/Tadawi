import { Router } from 'express';
import { requestHandlerWrapper } from '../lib/app-request-handler.js';
import { deleteAllNotification } from '../controllers/notifications/delete-all-notification.js';
import { getAllNotification } from '../controllers/notifications/get-all-notification.js';
const router = Router();
router.get('/', requestHandlerWrapper(getAllNotification));
router.delete('/', requestHandlerWrapper(deleteAllNotification));
export default router;
