import { Router } from 'express';

import AccountController from '../controllers/AccountController';

const router = Router();
const constroller = new AccountController();

router.post('/', constroller.create);
router.post('/login', constroller.login);
router.post('/forgot', constroller.forgotPassword);
router.post('/change-password', constroller.changePasswordByToken);

export default router;
