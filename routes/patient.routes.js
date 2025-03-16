import { Router } from 'express';
import { requestHandlerWrapper } from '../lib/app-request-handler.js';
import { getAllPatients } from '../controllers/patients/get-all-patients.js';
import { getSinglePatient } from '../controllers/patients/get-single-patient.js';
const router = Router();
router.get('/', requestHandlerWrapper(getAllPatients));
router.get('/:patientId', requestHandlerWrapper(getSinglePatient));
export default router;
