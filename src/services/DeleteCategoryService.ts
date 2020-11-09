import NotFound from '../errors/NotFound';

import ContactsRepository from '../repositories/ContactsRepository';

interface Request {
  userExternalId: string;
  contactExternalId: string;
  categoryName: string;
}

class DeleteCategoryService {
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

    await repository.deleteCategory(contact.id, categoryName);
  }
}

export default DeleteCategoryService;
