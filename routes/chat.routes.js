import { Router } from 'express';
import { requestHandlerWrapper } from '../lib/app-request-handler.js';
import { getAllMessages } from '../controllers/chat/get-all-messages.js';
import { getChatContacts } from '../controllers/chat/get-contacts.js';
import { sendMessage } from '../controllers/chat/send-message.js';

const router = Router();

router.get('/get-contacts', requestHandlerWrapper(getChatContacts));
router.get('/:matchId/messages', requestHandlerWrapper(getAllMessages));
router.post('/:matchId/messages', requestHandlerWrapper(sendMessage));

export default router;
