import User from '../models/User';
import database from '../utils/database';

interface CreateUserRequest {
  name: string;
  surname: string;
  email: string;
  hashedPassword: string;
}

interface CreateUserResponse {
  externalId: string;
  name: string;
  surname: string;
  email: string;
}

interface CreateForgotTokenRequest {
  email: string;
}

interface CreateForgotTokenResponse {
  forgotToken: string;
  expirationDate: Date;
}

interface DeleteForgotTokenRequest {
  token: string;
}

interface ChangePasswordRequest {
  userId: number;
  hashedPassword: string;
}

export default class AccountRepository {
  public async findByEmail(email: string): Promise<User | undefined> {
    const conn = await database.connect();

    try {
      const result = await conn.query(
        `
          SELECT
            id_user AS id,
            id_user_external AS "externalId",
            name,
            surname,
            email,
            password
          FROM tb_user
          WHERE email = $1;
        `,
        [email],
      );

      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  public async findByForgotToken(token: string): Promise<User | undefined> {
    const conn = await database.connect();

    try {
      const result = await conn.query(
        `
          SELECT
            id_user AS id,
            id_user_external AS "externalId",
            name,
            surname,
            email,
            password
          FROM tb_user u
          INNER JOIN tb_user_forget uf
            ON u.id_user = uf.fk_user
              AND token = $1
              AND dt_expires >= NOW();
        `,
        [token],
      );

      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  public async logLogin(fkUser: number, ip: string): Promise<void> {
    const conn = await database.connect();

    try {
      await conn.query(
        `
          INSERT INTO tb_login_log (
            fk_user,
            ip
          ) VALUES ($1, $2);
        `,
        [fkUser, ip],
      );
    } catch {
      // eslint-disable-next-line no-console
      console.error('Error on log login: ', { fkUser, ip });
    } finally {
      conn.release();
    }
  }

  public async create({
    name,
    surname,
    email,
    hashedPassword,
  }: CreateUserRequest): Promise<CreateUserResponse> {
    const conn = await database.connect();

    try {
      const result = await conn.query(
        `
          INSERT INTO tb_user(name, surname, email, password)
          VALUES ($1, $2, $3, $4)
          RETURNING
            id_user_external AS "externalId",
            name,
            surname,
            email;
        `,
        [name, surname, email, hashedPassword],
      );

      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  public async changePassword({
    userId,
    hashedPassword,
  }: ChangePasswordRequest): Promise<void> {
    const conn = await database.connect();

    try {
      await conn.query(
        `
          UPDATE tb_user
          SET password = $2
          WHERE id_user = $1;
        `,
        [userId, hashedPassword],
      );
    } finally {
      conn.release();
    }
  }

  public async createForgotToken({
    email,
  }: CreateForgotTokenRequest): Promise<CreateForgotTokenResponse> {
    const conn = await database.connect();

    try {
      const result = await conn.query(
        `
          INSERT INTO tb_user_forget (fk_user)
          VALUES (
            (
              SELECT id_user
              FROM tb_user
              WHERE email = $1
            )
          )
          RETURNING
            token AS "forgotToken",
            dt_expires AS "expirationDate";
        `,
        [email],
      );

      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  public async deleteForgotToken({
    token,
  }: DeleteForgotTokenRequest): Promise<void> {
    const conn = await database.connect();

    try {
      await conn.query(
        `
          DELETE FROM tb_user_forget
          WHERE token = $1;
        `,
        [token],
      );
    } finally {
      conn.release();
    }
  }
}
