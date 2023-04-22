import { PoolClient } from 'pg';

import Contact, {
  ContactAddress,
  ContactCategory,
  ContactEmail,
  ContactPhone,
  ExternalContact,
} from '../models/Contact';

import database from '../utils/database';

interface CreateRequestEmail {
  email: string;
  description?: string;
}

interface CreateRequestPhone {
  number: string;
  description?: string;
}

interface CreateRequestAddress {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  address: string;
  number: string;
  complement?: string;
  description?: string;
}

interface CreateRequestCategory {
  name: string;
}

interface CreateRequest {
  externalUserId: string;
  name: string;
  surname?: string;
  isFavorite?: boolean;
  birthday?: Date;
  observation?: string;
  emails: CreateRequestEmail[];
  categories: CreateRequestCategory[];
  phones: CreateRequestPhone[];
  addresses: CreateRequestAddress[];
}

interface CreateResponse {
  externalId: string;
  name: string;
  surname?: string;
  isFavorite?: boolean;
  birthday?: Date;
  observation?: string;
  emails: CreateRequestEmail[];
  categories: CreateRequestCategory[];
  phones: CreateRequestPhone[];
  addresses: CreateRequestAddress[];
}

interface UpdateRequest {
  fkContact: number;
  name: string;
  surname?: string;
  isFavorite?: boolean;
  birthday?: Date;
  observation?: string;
  emails: CreateRequestEmail[];
  categories: CreateRequestCategory[];
  phones: CreateRequestPhone[];
  addresses: CreateRequestAddress[];
}

interface FindByExternalIdRequest {
  userExternalId: string;
  contactExternalId: string;
}

export default class ContactsRepository {
  private async insertEmails(
    conn: PoolClient,
    fkContact: number,
    emails: CreateRequestEmail[],
  ): Promise<ContactEmail[]> {
    if (emails.length === 0) return [];

    let paramCounter = 2;

    const { rows: insertedContactEmails } = await conn.query(
      `
        INSERT INTO tb_contact_email (
          fk_contact,
          email,
          description
        ) VALUES
        ${emails
          .map(() => `($1, $${paramCounter++}, $${paramCounter++})`)
          .join(', ')}
        RETURNING
          email,
          description;
      `,
      [
        fkContact,
        ...emails.reduce(
          (acum, { email, description }) => [...acum, email, description],
          [] as (string | undefined)[],
        ),
      ],
    );

    return insertedContactEmails;
  }

  private async insertCategories(
    conn: PoolClient,
    fkContact: number,
    categories: CreateRequestCategory[],
  ): Promise<ContactCategory[]> {
    if (categories.length === 0) return [];

    let paramCounter = 2;

    const { rows: insertedCategories } = await conn.query(
      `
        INSERT INTO tb_contact_category (
          fk_contact,
          name
        ) VALUES
        ${categories.map(() => `($1, $${paramCounter++})`).join(', ')}
        RETURNING
          name;
      `,
      [
        fkContact,
        ...categories.reduce(
          (acum, { name }) => [...acum, name],
          [] as (string | undefined)[],
        ),
      ],
    );

    return insertedCategories;
  }

  private async insertPhones(
    conn: PoolClient,
    fkContact: number,
    phones: CreateRequestPhone[],
  ): Promise<ContactPhone[]> {
    if (phones.length === 0) return [];

    let paramCounter = 2;

    const { rows: insertedContactPhones } = await conn.query(
      `
        INSERT INTO tb_contact_phone (
          fk_contact,
          number,
          description
        ) VALUES
        ${phones
          .map(() => `($1, $${paramCounter++}, $${paramCounter++})`)
          .join(', ')}
        RETURNING
          number,
          description;
      `,
      [
        fkContact,
        ...phones.reduce(
          (acum, { number, description }) => [...acum, number, description],
          [] as (string | undefined)[],
        ),
      ],
    );

    return insertedContactPhones;
  }

  private async insertAddresses(
    conn: PoolClient,
    fkContact: number,
    addresses: CreateRequestAddress[],
  ): Promise<ContactAddress[]> {
    if (addresses.length === 0) return [];

    let paramCounter = 2;

    const { rows: insertedContactAddresses } = await conn.query(
      `
        INSERT INTO tb_contact_address (
          fk_contact,
          cep,
          state,
          city,
          neighborhood,
          address,
          number,
          complement,
          description
        ) VALUES
        ${addresses
          .map(
            () =>
              `(
                $1,
                $${paramCounter++},
                $${paramCounter++},
                $${paramCounter++},
                $${paramCounter++},
                $${paramCounter++},
                $${paramCounter++},
                $${paramCounter++},
                $${paramCounter++}
              )`,
          )
          .join(', ')}
        RETURNING
          cep,
          state,
          city,
          neighborhood,
          address,
          number,
          complement,
          description;
      `,
      [
        fkContact,
        ...addresses.reduce(
          (
            acum,
            {
              cep,
              state,
              city,
              neighborhood,
              address,
              number,
              complement,
              description,
            },
          ) => [
            ...acum,
            cep,
            state,
            city,
            neighborhood,
            address,
            number,
            complement,
            description,
          ],
          [] as (string | undefined)[],
        ),
      ],
    );

    return insertedContactAddresses;
  }

  private async removeAllPhonesByContact(
    conn: PoolClient,
    fkContact: number,
  ): Promise<void> {
    await conn.query(
      `
        DELETE FROM tb_contact_phone
        WHERE fk_contact = $1;
      `,
      [fkContact],
    );
  }

  private async removeAllCategoriesByContact(
    conn: PoolClient,
    fkContact: number,
  ): Promise<void> {
    await conn.query(
      `
        DELETE FROM tb_contact_category
        WHERE fk_contact = $1;
      `,
      [fkContact],
    );
  }

  private async removeAllEmailsByContact(
    conn: PoolClient,
    fkContact: number,
  ): Promise<void> {
    await conn.query(
      `
        DELETE FROM tb_contact_email
        WHERE fk_contact = $1;
      `,
      [fkContact],
    );
  }

  private async removeAllAddressesByContact(
    conn: PoolClient,
    fkContact: number,
  ): Promise<void> {
    await conn.query(
      `
        DELETE FROM tb_contact_address
        WHERE fk_contact = $1;
      `,
      [fkContact],
    );
  }

  public async create({
    externalUserId,
    name,
    surname,
    isFavorite,
    birthday,
    observation,
    emails,
    categories,
    phones,
    addresses,
  }: CreateRequest): Promise<CreateResponse> {
    const conn = await database.connect();

    try {
      conn.query('BEGIN;');

      const {
        rows: [insertedContact],
      } = await conn.query<Contact>(
        `
          INSERT INTO tb_contact (
            fk_user,
            name,
            surname,
            fg_favorite,
            birthday,
            observation
          ) VALUES (
            (
              SELECT id_user
              FROM tb_user u
              WHERE u.id_user_external = $1
            ), $2, $3, $4, $5, $6
          ) RETURNING
            id_contact AS id,
            id_contact_external AS "externalId",
            name,
            surname,
            fg_favorite AS "isFavorite",
            photo_name AS "photoName",
            birthday,
            observation;
        `,
        [externalUserId, name, surname, isFavorite, birthday, observation],
      );

      const [
        insertedEmails,
        insertedCategories,
        insertedPhones,
        insertedAddresses,
      ] = await Promise.all([
        this.insertEmails(conn, insertedContact.id, emails),
        this.insertCategories(conn, insertedContact.id, categories),
        this.insertPhones(conn, insertedContact.id, phones),
        this.insertAddresses(conn, insertedContact.id, addresses),
      ]);

      insertedContact.emails = insertedEmails;
      insertedContact.categories = insertedCategories;
      insertedContact.phones = insertedPhones;
      insertedContact.addresses = insertedAddresses;

      conn.query('COMMIT;');

      return {
        externalId: insertedContact.externalId,
        name: insertedContact.name,
        surname: insertedContact.surname,
        isFavorite: insertedContact.isFavorite,
        birthday: insertedContact.birthday,
        observation: insertedContact.observation,
        emails: insertedContact.emails,
        categories: insertedContact.categories,
        phones: insertedContact.phones,
        addresses: insertedContact.addresses,
      };
    } catch (e) {
      conn.query('ROLLBACK;');

      throw e;
    } finally {
      conn.release();
    }
  }

  public async update({
    fkContact,
    name,
    surname,
    isFavorite,
    birthday,
    observation,
    emails,
    categories,
    phones,
    addresses,
  }: UpdateRequest): Promise<ExternalContact> {
    const conn = await database.connect();

    try {
      conn.query('BEGIN;');

      const {
        rows: [updatedContact],
      } = await conn.query<Contact>(
        `
          UPDATE tb_contact
          SET
            name = $2,
            surname = $3,
            fg_favorite = $4,
            birthday = $5,
            observation = $6
          WHERE id_contact = $1
          RETURNING
            id_contact AS id,
            id_contact_external AS "externalId",
            name,
            surname,
            fg_favorite AS "isFavorite",
            photo_name AS "photoName",
            birthday,
            observation;
        `,
        [fkContact, name, surname, isFavorite, birthday, observation],
      );

      await Promise.all([
        this.removeAllEmailsByContact(conn, fkContact),
        this.removeAllCategoriesByContact(conn, fkContact),
        this.removeAllPhonesByContact(conn, fkContact),
        this.removeAllAddressesByContact(conn, fkContact),
      ]);

      const [
        insertedEmails,
        insertedCategories,
        insertedPhones,
        insertedAddresses,
      ] = await Promise.all([
        this.insertEmails(conn, fkContact, emails),
        this.insertCategories(conn, fkContact, categories),
        this.insertPhones(conn, fkContact, phones),
        this.insertAddresses(conn, fkContact, addresses),
      ]);

      updatedContact.emails = insertedEmails;
      updatedContact.categories = insertedCategories;
      updatedContact.phones = insertedPhones;
      updatedContact.addresses = insertedAddresses;

      conn.query('COMMIT;');

      return {
        id: updatedContact.externalId,
        name: updatedContact.name,
        surname: updatedContact.surname,
        isFavorite: updatedContact.isFavorite,
        photoName: updatedContact.photoName,
        birthday: updatedContact.birthday,
        observation: updatedContact.observation,
        emails: updatedContact.emails,
        categories: updatedContact.categories,
        phones: updatedContact.phones,
        addresses: updatedContact.addresses,
      };
    } catch (e) {
      conn.query('ROLLBACK;');

      throw e;
    } finally {
      conn.release();
    }
  }

  public async delete(fkContact: number): Promise<void> {
    const conn = await database.connect();

    try {
      conn.query('BEGIN;');

      await Promise.all([
        this.removeAllEmailsByContact(conn, fkContact),
        this.removeAllCategoriesByContact(conn, fkContact),
        this.removeAllPhonesByContact(conn, fkContact),
        this.removeAllAddressesByContact(conn, fkContact),
      ]);

      await conn.query<Contact>(
        `
          DELETE FROM tb_contact
          WHERE id_contact = $1;
        `,
        [fkContact],
      );

      conn.query('COMMIT;');
    } catch (e) {
      conn.query('ROLLBACK;');

      throw e;
    } finally {
      conn.release();
    }
  }

  public async favorite(fkContact: number): Promise<boolean> {
    const conn = await database.connect();

    try {
      const {
        rows: [{ isFavorite }],
      } = await conn.query<{ isFavorite: boolean }>(
        `
          UPDATE tb_contact
          SET fg_favorite = NOT fg_favorite
          WHERE id_contact = $1
          RETURNING
            fg_favorite AS "isFavorite";
        `,
        [fkContact],
      );

      return isFavorite;
    } finally {
      conn.release();
    }
  }

  public async updatePhoto(
    fkContact: number,
    photoName: string | null,
  ): Promise<void> {
    const conn = await database.connect();

    try {
      await conn.query(
        `
          UPDATE tb_contact
          SET photo_name = $2
          WHERE id_contact = $1;
        `,
        [fkContact, photoName],
      );
    } finally {
      conn.release();
    }
  }

  public async addCategory(
    fkContact: number,
    categoryName: string,
  ): Promise<void> {
    const conn = await database.connect();

    try {
      await conn.query<Contact>(
        `
          INSERT INTO tb_contact_category (
            fk_contact,
            name
          ) VALUES ($1, $2);
        `,
        [fkContact, categoryName],
      );
    } finally {
      conn.release();
    }
  }

  public async deleteCategory(
    fkContact: number,
    categoryName: string,
  ): Promise<void> {
    const conn = await database.connect();

    try {
      await conn.query<Contact>(
        `
          DELETE FROM tb_contact_category
          WHERE fk_contact = $1
            AND name = $2;
        `,
        [fkContact, categoryName],
      );
    } finally {
      conn.release();
    }
  }

  public async findByExternalId({
    userExternalId,
    contactExternalId,
  }: FindByExternalIdRequest): Promise<Contact> {
    const conn = await database.connect();

    try {
      const {
        rows: [contact],
      } = await conn.query(
        `
          SELECT
            c.id_contact AS "id",
            c.id_contact_external AS "externalId",
            c.name,
            c.surname,
            c.fg_favorite AS "isFavorite",
            c.photo_name AS "photoName",
            c.birthday,
            c.observation,
            ARRAY(
              SELECT
                json_build_object(
                  'email', ce.email,
                  'description', ce.description
                )
              FROM tb_contact_email ce
              WHERE ce.fk_contact = c.id_contact
            ) AS emails,
            ARRAY(
              SELECT
                json_build_object(
                  'number', cp.number,
                  'description', cp.description
                )
              FROM tb_contact_phone cp
              WHERE cp.fk_contact = c.id_contact
            ) AS phones,
            ARRAY(
              SELECT
                json_build_object(
                  'cep', ca.cep,
                  'state', ca.state,
                  'city', ca.city,
                  'neighborhood', ca.neighborhood,
                  'address', ca.address,
                  'number', ca.number,
                  'complement', ca.complement,
                  'description', ca.description
                )
              FROM tb_contact_address ca
              WHERE ca.fk_contact = c.id_contact
            ) AS addresses,
            ARRAY(
              SELECT
                json_build_object(
                  'name', cc.name
                )
              FROM tb_contact_category cc
              WHERE cc.fk_contact = c.id_contact
            ) AS categories
          FROM tb_contact c
          INNER JOIN tb_user u
            ON c.fk_user = u.id_user
              AND u.id_user_external = $1
          WHERE c.id_contact_external = $2;
        `,
        [userExternalId, contactExternalId],
      );

      return contact;
    } finally {
      conn.release();
    }
  }

  public async findAllByUserExternalId(
    userExternalId: string,
  ): Promise<Contact[]> {
    const conn = await database.connect();

    try {
      const result = await conn.query(
        `
          SELECT
            c.id_contact_external AS "id",
            c.name,
            c.surname,
            c.fg_favorite AS "isFavorite",
            c.photo_name AS "photoName",
            c.birthday,
            c.observation,
            ARRAY(
              SELECT
                json_build_object(
                  'email', ce.email,
                  'description', ce.description
                )
              FROM tb_contact_email ce
              WHERE ce.fk_contact = c.id_contact
            ) AS emails,
            ARRAY(
              SELECT
                json_build_object(
                  'number', cp.number,
                  'description', cp.description
                )
              FROM tb_contact_phone cp
              WHERE cp.fk_contact = c.id_contact
            ) AS phones,
            ARRAY(
              SELECT
                json_build_object(
                  'cep', ca.cep,
                  'state', ca.state,
                  'city', ca.city,
                  'neighborhood', ca.neighborhood,
                  'address', ca.address,
                  'number', ca.number,
                  'complement', ca.complement,
                  'description', ca.description
                )
              FROM tb_contact_address ca
              WHERE ca.fk_contact = c.id_contact
            ) AS addresses,
            ARRAY(
              SELECT
                json_build_object(
                  'name', cc.name
                )
              FROM tb_contact_category cc
              WHERE cc.fk_contact = c.id_contact
            ) AS categories
          FROM tb_contact c
          INNER JOIN tb_user u
            ON c.fk_user = u.id_user
              AND u.id_user_external = $1;
        `,
        [userExternalId],
      );

      return result.rows;
    } finally {
      conn.release();
    }
  }
}
