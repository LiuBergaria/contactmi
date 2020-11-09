import { compare } from 'bcryptjs';

import IncorrectInformations from '../errors/IncorrectInformations';
import User from '../models/User';
import AccountRepository from '../repositories/AccountRepository';
import TokenService from './TokenService';

interface Request {
  email: string;
  password: string;
  ip: string;
}

interface Response {
  user: { id: string; name: string; surname: string; email: string };
  token: string;
}

class LoginService {
  public async run({ email, password, ip }: Request): Promise<Response> {
    const repository = new AccountRepository();

    const user = await repository.findByEmail(email);

    if (!user) {
      throw new IncorrectInformations('Email or password incorrect.');
    }

    const passwordMatches = await compare(password, user.password);

    if (!passwordMatches) {
      throw new IncorrectInformations('Email or password incorrect.');
    }

    await repository.logLogin(user.id, ip);

    const tokenService = new TokenService();

    const token = await tokenService.run(user.externalId);

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

export default LoginService;
