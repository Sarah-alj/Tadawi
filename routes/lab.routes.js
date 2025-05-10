import { Router } from 'express';
import { requestHandlerWrapper } from '../lib/app-request-handler.js';
import { createLabAppointment } from '../controllers/lab/create-lab-appointment.js';
import { getDataForLabPage } from '../controllers/lab/get-data-for-lab-page.js';
import { getAllLabs } from '../controllers/lab/get-all-labs.js';

const router = Router();

router.get('/', requestHandlerWrapper(getAllLabs));
router.get('/get-data-for-lab-page', requestHandlerWrapper(getDataForLabPage));
router.post('/create-appointment', requestHandlerWrapper(createLabAppointment));

export default router;
