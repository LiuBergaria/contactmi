import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import config from '../config';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthentication(
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decodedData = verify(token, config.jwt.SECRET) as TokenPayload;

    req.user = {
      externalId: decodedData.sub,
    };

    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
}
