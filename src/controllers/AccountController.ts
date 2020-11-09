import { NextFunction, Request, Response } from 'express';

// services
import CreateUserService from '../services/CreateUserService';
import LoginService from '../services/LoginService';
import ForgotPasswordService from '../services/ForgotPasswordService';

// errors
import DuplicateInformation from '../errors/DuplicateInformation';
import IncorrectInformations from '../errors/IncorrectInformations';

// schemas
import createAccountSchema from '../schemas/createAccountSchema';
import loginSchema from '../schemas/loginSchema';
import forgotPasswordSchema from '../schemas/forgotPasswordSchema';
import changePasswordSchema from '../schemas/changePasswordSchema';
import ChangePasswordService from '../services/ChangePasswordService';
import NotFound from '../errors/NotFound';

export default class AccountController {
  public async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { name, surname, email, password } = req.body;

      await createAccountSchema.validate(
        { name, surname, email, password },
        { abortEarly: false },
      );

      const createUserService = new CreateUserService();

      const user = await createUserService.run({
        name,
        surname,
        email,
        password,
      });

      return res.status(201).send(user);
    } catch (e) {
      if (e instanceof DuplicateInformation) {
        return res.status(400).send({
          validationErrors: {
            email: 'E-mail já cadastrado',
          },
        });
      }

      return next(e);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { email, password } = req.body;

      const ip = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress) as string;

      await loginSchema.validate({ email, password }, { abortEarly: false });

      const loginService = new LoginService();

      const userAndToken = await loginService.run({ email, password, ip });

      return res.status(200).send(userAndToken);
    } catch (e) {
      if (e instanceof IncorrectInformations) {
        return res.status(400).send({
          validationErrors: {
            email: 'E-mail e/ou senha incorretos',
            password: 'E-mail e/ou senha incorretos',
          },
        });
      }

      return next(e);
    }
  }

  public async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { email } = req.body;

      await forgotPasswordSchema.validate({ email }, { abortEarly: false });

      const forgotPasswordService = new ForgotPasswordService();

      await forgotPasswordService.run({
        email,
      });

      return res.status(200).send({ message: 'E-mail enviado' });
    } catch (e) {
      if (e instanceof IncorrectInformations) {
        return res.status(400).send({
          validationErrors: {
            email: 'E-mail e/ou senha incorretos',
            password: 'E-mail e/ou senha incorretos',
          },
        });
      }

      return next(e);
    }
  }

  public async changePasswordByToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { token, password } = req.body;

      await changePasswordSchema.validate(
        { token, password },
        { abortEarly: false },
      );

      const changePasswordService = new ChangePasswordService();

      await changePasswordService.run({
        token,
        password,
      });

      return res.status(200).send({ message: 'Senha alterada com sucesso' });
    } catch (e) {
      if (e instanceof NotFound) {
        return res.status(400).send({
          validationErrors: { token: 'Token inválido ou não encontrado' },
        });
      }

      return next(e);
    }
  }
}
