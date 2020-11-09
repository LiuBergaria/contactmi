import { hash } from 'bcryptjs';

import config from '../config';
import NotFound from '../errors/NotFound';
import AccountRepository from '../repositories/AccountRepository';

interface Request {
  token: string;
  password: string;
}

class ChangePasswordService {
  public async run({ token, password }: Request): Promise<void> {
    const repository = new AccountRepository();

    const user = await repository.findByForgotToken(token);

    if (!user) {
      throw new NotFound('Token not found.');
    }

    const hashedPassword = await hash(password, config.BCRYPT_SALT);

    await repository.changePassword({
      userId: user.id,
      hashedPassword,
    });

    await repository.deleteForgotToken({
      token,
    });
  }
}

export default ChangePasswordService;
