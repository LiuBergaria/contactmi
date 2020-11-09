import './dotenv';

const expectedVariables = [
  'SERVER_PORT',
  'BCRYPT_SALT',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'DATABASE_NAME',
  'DATABASE_MAX',
];

const missingVariables = expectedVariables.filter(
  variable => process.env[variable] === undefined,
);

if (missingVariables.length > 0) {
  // eslint-disable-next-line no-console
  console.error(
    `The following environment variables were not found: ${missingVariables.join(
      ', ',
    )}`,
  );

  process.exit(1);
}

const config = {
  SERVER_PORT: process.env.SERVER_PORT as string,
  BCRYPT_SALT: parseInt(process.env.BCRYPT_SALT as string, 10),
  jwt: {
    SECRET: process.env.JWT_SECRET as string,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
  },
  database: {
    HOST: process.env.DATABASE_HOST as string,
    PORT: parseInt(process.env.DATABASE_PORT as string, 10),
    USER: process.env.DATABASE_USER as string,
    PASSWORD: process.env.DATABASE_PASSWORD as string,
    NAME: process.env.DATABASE_NAME as string,
    MAX: parseInt(process.env.DATABASE_MAX as string, 10),
  },
};

export default config;
