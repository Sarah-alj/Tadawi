import { Router } from 'express';
import { requestHandlerWrapper } from '../lib/app-request-handler.js';
import { getAllDiseases } from '../controllers/disease-types/get-all-disease.js';
const router = Router();
router.get('/', requestHandlerWrapper(getAllDiseases));
export default router;
