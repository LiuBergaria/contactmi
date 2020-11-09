import { NextFunction, Request, Response } from 'express';
import NotFound from '../errors/NotFound';

// repositories
import ContactsRepository from '../repositories/ContactsRepository';
import createAccountSchema from '../schemas/createAccountSchema';
import createCategorySchema from '../schemas/createCategorySchema';

// schemas
import createContactSchema from '../schemas/createContactSchema';
import AddCategoryService from '../services/AddCategoryService';
import DeleteCategoryService from '../services/DeleteCategoryService';
import DeleteContactPhoto from '../services/DeleteContactPhoto';
import DeleteContactService from '../services/DeleteContactService';
import FavoriteContactService from '../services/FavoriteContactService';
import UpdateContactPhoto from '../services/UpdateContactPhoto';
import UpdateContactService from '../services/UpdateContactService';

export default class ContactsController {
  public async findAll(req: Request, res: Response): Promise<Response | void> {
    const repository = new ContactsRepository();

    const contacts = await repository.findAllByUserExternalId(
      req.user.externalId,
    );

    return res.status(200).send(contacts);
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const {
        name,
        surname,
        isFavorite,
        birthday,
        observation,
        emails,
        categories,
        phones,
        addresses,
      } = req.body;

      await createContactSchema.validate(
        {
          name,
          surname,
          isFavorite,
          birthday,
          observation,
          emails,
          categories,
          phones,
          addresses,
        },
        { abortEarly: false },
      );

      const repository = new ContactsRepository();

      const contact = await repository.create({
        externalUserId: req.user.externalId,
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

      const contactFiltered = {
        id: contact.externalId,
        name: contact.name,
        surname: contact.surname,
        isFavorite: contact.isFavorite,
        birthday: contact.birthday,
        observation: contact.observation,
        emails: contact.emails,
        categories: contact.categories,
        phones: contact.phones,
        addresses: contact.addresses,
      };

      return res.status(201).send(contactFiltered);
    } catch (e) {
      return next(e);
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const {
        name,
        surname,
        isFavorite,
        birthday,
        observation,
        emails,
        categories,
        phones,
        addresses,
      } = req.body;

      const { id: contactExternalId } = req.params;

      await createContactSchema.validate(
        {
          name,
          surname,
          isFavorite,
          birthday,
          observation,
          emails,
          categories,
          phones,
          addresses,
        },
        { abortEarly: false },
      );

      const service = new UpdateContactService();

      const updatedContact = await service.run({
        userExternalId: req.user.externalId,
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
      });

      return res.status(200).send(updatedContact);
    } catch (e) {
      if (e instanceof NotFound) {
        return res.status(404).send({
          message: 'Contato não encontrado',
        });
      }

      return next(e);
    }
  }

  public async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { id: contactExternalId } = req.params;

      const service = new DeleteContactService();

      await service.run({
        userExternalId: req.user.externalId,
        contactExternalId,
      });

      return res.status(200).send({ contact: { id: contactExternalId } });
    } catch (e) {
      if (e instanceof NotFound) {
        return res.status(404).send({
          message: 'Contato não encontrado',
        });
      }

      return next(e);
    }
  }

  public async updatePhoto(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { id: contactExternalId } = req.params;

      const photo = req.file;

      const service = new UpdateContactPhoto();

      await service.run({
        userExternalId: req.user.externalId,
        contactExternalId,
        photoName: photo.filename,
      });

      return res.status(200).send({
        contact: { id: contactExternalId, photoName: photo.filename },
      });
    } catch (e) {
      if (e instanceof NotFound) {
        return res.status(404).send({
          message: 'Contato não encontrado',
        });
      }

      return next(e);
    }
  }

  public async deletePhoto(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { id: contactExternalId } = req.params;

      const service = new DeleteContactPhoto();

      await service.run({
        userExternalId: req.user.externalId,
        contactExternalId,
      });

      return res.status(200).send({ contact: { id: contactExternalId } });
    } catch (e) {
      if (e instanceof NotFound) {
        return res.status(404).send({
          message: 'Contato não encontrado',
        });
      }

      return next(e);
    }
  }

  public async favorite(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { id: contactExternalId } = req.params;

      const service = new FavoriteContactService();

      const isFavorite = await service.run({
        userExternalId: req.user.externalId,
        contactExternalId,
      });

      return res
        .status(200)
        .send({ contact: { id: contactExternalId, isFavorite } });
    } catch (e) {
      if (e instanceof NotFound) {
        return res.status(404).send({
          message: 'Contato não encontrado',
        });
      }

      return next(e);
    }
  }

  public async addCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { name } = req.body;

      const { id: contactExternalId } = req.params;

      await createCategorySchema.validate({ name }, { abortEarly: false });

      const service = new AddCategoryService();

      await service.run({
        userExternalId: req.user.externalId,
        contactExternalId,
        categoryName: name,
      });

      return res.status(201).send({ contact: { id: contactExternalId }, name });
    } catch (e) {
      if (e instanceof NotFound) {
        return res.status(404).send({
          message: 'Contato não encontrado',
        });
      }

      return next(e);
    }
  }

  public async deleteCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { name } = req.body;

      const { id: contactExternalId } = req.params;

      const service = new DeleteCategoryService();

      await service.run({
        userExternalId: req.user.externalId,
        contactExternalId,
        categoryName: name,
      });

      return res.status(201).send({ contact: { id: contactExternalId }, name });
    } catch (e) {
      if (e instanceof NotFound) {
        return res.status(404).send({
          message: 'Contato não encontrado',
        });
      }

      return next(e);
    }
  }
}
