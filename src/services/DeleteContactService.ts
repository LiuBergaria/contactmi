import NotFound from '../errors/NotFound';

import ContactsRepository from '../repositories/ContactsRepository';

interface Request {
  userExternalId: string;
  contactExternalId: string;
}

class DeleteContactService {
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

    await repository.delete(contact.id);
  }
}

export default DeleteContactService;
