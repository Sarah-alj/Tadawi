import { Router } from 'express';
import { requestHandlerWrapper } from '../lib/app-request-handler.js';

import { loginController } from '../controllers/login/login-controller.js';
import { verifyOtpController } from '../controllers/login/verify-otp.js';
import { signupController } from '../controllers/signup/signup-controller.js';
import { logoutController } from '../controllers/logout/logout-controller.js';

import { requestResetPassword } from '../controllers/login/request-reset-password-controller.js';
import { resetPasswordController } from '../controllers/login/reset-password-controller.js';

const router = Router();

router.post('/signup', requestHandlerWrapper(signupController));
router.post('/login', requestHandlerWrapper(loginController));
router.post('/verify-otp', requestHandlerWrapper(verifyOtpController));
router.post('/logout', requestHandlerWrapper(logoutController));

router.post('/request-reset-password', requestHandlerWrapper(requestResetPassword));
router.post('/reset-password', requestHandlerWrapper(resetPasswordController));

export default router;
