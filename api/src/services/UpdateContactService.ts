import NotFound from '../errors/NotFound';
import { ExternalContact } from '../models/Contact';

import ContactsRepository from '../repositories/ContactsRepository';

interface Request extends Omit<ExternalContact, 'id'> {
  userExternalId: string;
  contactExternalId: string;
}

class UpdateContactService {
  public async run({
    userExternalId,
    contactExternalId,
    name,
    surname,
    isFavorite,
    birthday,
    observation,
    emails,
    categories,
    phones,
    addresses,
  }: Request): Promise<ExternalContact> {
    const repository = new ContactsRepository();

    const contact = await repository.findByExternalId({
      userExternalId,
      contactExternalId,
    });

    if (!contact) {
      throw new NotFound('Contact not found.');
    }

    const updatedContact = await repository.update({
      fkContact: contact.id,
      name,
      surname,
      isFavorite,
      birthday,
      observation,
      emails,
      categories,
      phones,
      addresses,
    });

    return updatedContact;
  }
}

export default UpdateContactService;
