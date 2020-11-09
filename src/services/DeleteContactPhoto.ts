import path from 'path';
import fs from 'fs';
import uploadConfig from '../config/upload';

import NotFound from '../errors/NotFound';
import ContactsRepository from '../repositories/ContactsRepository';

interface Request {
  userExternalId: string;
  contactExternalId: string;
}

class DeleteContactPhoto {
  public async run({
    contactExternalId,
    userExternalId,
  }: Request): Promise<void> {
    const repository = new ContactsRepository();

    const contact = await repository.findByExternalId({
      contactExternalId,
      userExternalId,
    });

    if (!contact) {
      throw new NotFound('Contact not found.');
    }

    if (contact.photoName) {
      const oldPhotoPath = path.join(uploadConfig.directory, contact.photoName);

      const fileExists = await fs.promises.stat(oldPhotoPath);

      if (fileExists) await fs.promises.unlink(oldPhotoPath);
    }

    await repository.updatePhoto(contact.id, null);
  }
}

export default DeleteContactPhoto;
