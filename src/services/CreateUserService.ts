import { hash } from 'bcryptjs';

import config from '../config';
import DuplicateInformation from '../errors/DuplicateInformation';
import AccountRepository from '../repositories/AccountRepository';
import SendEmailService from './SendEmailService';
import TokenService from './TokenService';

// interfaces
interface Request {
  name: string;
  surname: string;
  email: string;
  password: string;
}

interface Response {
  user: { id: string; name: string; surname: string; email: string };
  token: string;
}

class CreateUserService {
  public async run({
    name,
    surname,
    email,
    password,
  }: Request): Promise<Response> {
    const repository = new AccountRepository();

    const userExists = await repository.findByEmail(email);

    if (userExists) {
      throw new DuplicateInformation('Email already used.');
    }

    const hashedPassword = await hash(password, config.BCRYPT_SALT);

    const user = await repository.create({
      name,
      surname,
      email,
      hashedPassword,
    });

    const tokenService = new TokenService();

    const token = await tokenService.run(user.externalId);

    const emailBody = `
      <html>
      <head>
        <style>
          * {
            margin: 0;
            padding: 0;
            font-family: sans-serif;
          }
          .container {
            width: 100%;
            padding: 24px 16px;
            box-sizing: border-box;
          }
          .logo {
            display: block;
            margin: 0 auto;
            width: 150px;
            max-width: 100%;
          }
          .title {
            margin-top: 32px;
            font-size: 1.5rem;
          }
          .text {
            margin-top: 16px;
            font-size: 1rem;
            line-height: 1.5rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img class="logo" src="https://i.imgur.com/F2lJzxz.png" />
          <h1 class="title">Olá, ${user.name}!</h1>
          <p class="text">
            Seja bem-vindo ao ContactMi! Você já pode entrar utilizando suas credenciais. <br />
            <br />
            Estamos constantemente melhorando nossa plataforma para te dar a melhor experiência possível.<br />
            Esperamos que aproveite :)
          </p>
        </div>
      </body>
      </html>
    `;

    const sendEmailService = new SendEmailService();

    await sendEmailService.run({
      to: {
        name: `${user.name} ${user.surname}`,
        email,
      },
      subject: 'Seja bem-vindo!',
      body: emailBody,
    });

    return {
      user: {
        id: user.externalId,
        name: user.name,
        surname: user.surname,
        email: user.email,
      },
      token,
    };
  }
}

export default CreateUserService;
