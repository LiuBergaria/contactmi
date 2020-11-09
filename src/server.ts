import express, { NextFunction, Request, Response } from 'express';
import * as Yup from 'yup';
import cors from 'cors';

import 'express-async-errors';

import config from './config';
import uploadConfig from './config/upload';

import router from './routes';
import getValidationErrors from './utils/getValidationErrors';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(router);

app.listen(config.SERVER_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on ${config.SERVER_PORT}`);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/no-unused-vars
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Yup.ValidationError) {
    return res.status(400).json({ validationErrors: getValidationErrors(err) });
  }

  // eslint-disable-next-line no-console
  console.error(err);

  return res.status(500).json({
    message:
      'Ocorreu um erro no servidor. Por favor, verifique a solicitação e tente novamente mais tarde. Se o erro persistir, entre em contato conosco.',
  });
});
