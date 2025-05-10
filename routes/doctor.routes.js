import { Router } from 'express';
import { requestHandlerWrapper } from '../lib/app-request-handler.js';
import { getAllDoctors } from '../controllers/doctors/get-all-doctors.js';
import { getSingleDoctor } from '../controllers/doctors/get-single-doctor.js';
import { getDoctorContactInfo } from '../controllers/doctors/get-doctor-contact-info.js';

const router = Router();

router.get('/', requestHandlerWrapper(getAllDoctors));
router.get('/:doctorId', requestHandlerWrapper(getSingleDoctor));
router.get('/contact-info/:doctorId', requestHandlerWrapper(getDoctorContactInfo));

export default router;
