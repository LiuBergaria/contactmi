import NotFound from '../errors/NotFound';

import ContactsRepository from '../repositories/ContactsRepository';

interface Request {
  userExternalId: string;
  contactExternalId: string;
  categoryName: string;
}

class AddCategoryService {
  public async run({
    contactExternalId,
    userExternalId,
    categoryName,
  }: Request): Promise<void> {
    const repository = new ContactsRepository();

    const contact = await repository.findByExternalId({
      contactExternalId,
      userExternalId,
    });

    if (!contact) {
      throw new NotFound('Contact not found.');
    }

    repository.addCategory(contact.id, categoryName);
  }
}

export default AddCategoryService;
