declare namespace Express {
  export interface Request {
    user: {
      externalId: string;
    };
  }
}
