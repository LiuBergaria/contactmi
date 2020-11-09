import { sign } from 'jsonwebtoken';

import config from '../config';

class TokenService {
  public async run(externalUserId: string): Promise<string> {
    const token = sign({}, config.jwt.SECRET, {
      subject: externalUserId,
      expiresIn: config.jwt.EXPIRES_IN,
    });

    return token;
  }
}

export default TokenService;
