import { Router } from 'express';
import { requestHandlerWrapper } from '../lib/app-request-handler.js';
import { createDonationController } from '../controllers/donation/create-donation-controller.js';
import { getAllDonationsController } from '../controllers/donation/get-all-donation-controller.js';
import { deleteDonationController } from '../controllers/donation/delete-donation-controller.js';
import { getSingleDonationController } from '../controllers/donation/get-single-donation-controller.js';
import { updateDonationController } from '../controllers/donation/update-donation-controller.js';
import { acquireDonation } from '../controllers/donation/acquire-donation.js';

const router = Router();

router.get('/', requestHandlerWrapper(getAllDonationsController));
router.get('/:donationId', requestHandlerWrapper(getSingleDonationController));
router.post('/', requestHandlerWrapper(createDonationController));
router.delete('/:donationId', requestHandlerWrapper(deleteDonationController));
router.get('/:donationId', requestHandlerWrapper(getSingleDonationController));
router.put('/:donationId', requestHandlerWrapper(updateDonationController));
router.post('/:donationId/accept', requestHandlerWrapper(acquireDonation));

export default router;
