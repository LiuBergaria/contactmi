import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';

import ContactsController from '../controllers/ContactsController';

const router = Router();
const controller = new ContactsController();

router.get('/', controller.findAll);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

const upload = multer(uploadConfig);

router.put('/:id/photo', upload.single('photo'), controller.updatePhoto);
router.delete('/:id/photo', controller.deletePhoto);

router.patch('/:id/fav', controller.favorite);

router.post('/:id/tag', controller.addCategory);
router.delete('/:id/tag', controller.deleteCategory);

export default router;
