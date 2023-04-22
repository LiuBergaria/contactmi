import { Router } from 'express';

import ensureAuthentication from '../middlewares/ensureAuthentication';

import accountRoutes from './account.routes';
import contactsRoutes from './contacts.routes';

const router = Router();

router.use('/account', accountRoutes);

router.use(ensureAuthentication);
router.use('/contacts', contactsRoutes);

export default router;
