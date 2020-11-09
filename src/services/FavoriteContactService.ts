import NotFound from '../errors/NotFound';

import ContactsRepository from '../repositories/ContactsRepository';

interface Request {
  userExternalId: string;
  contactExternalId: string;
}

class FavoriteContactService {
  public async run({
    contactExternalId,
    userExternalId,
  }: Request): Promise<boolean> {
    const repository = new ContactsRepository();

    const contact = await repository.findByExternalId({
      contactExternalId,
      userExternalId,
    });

    if (!contact) {
      throw new NotFound('Contact not found.');
    }

    return repository.favorite(contact.id);
  }
}

export default FavoriteContactService;
