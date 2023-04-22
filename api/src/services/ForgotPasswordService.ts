import IncorrectInformations from '../errors/IncorrectInformations';
import AccountRepository from '../repositories/AccountRepository';
import SendEmailService from './SendEmailService';

interface Request {
  email: string;
}

class ForgotPasswordService {
  public async run({ email }: Request): Promise<void> {
    const repository = new AccountRepository();

    const user = await repository.findByEmail(email);

    if (!user) {
      throw new IncorrectInformations('Email or password incorrect.');
    }

    const { forgotToken } = await repository.createForgotToken({
      email,
    });

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
          .token {
            background-color: rgba(27,31,35,0.05);
            padding: .2em .4em;
            font-weight: bold;
          }
          .expiration {
            color: rgba(0, 0, 0, .6);
            font-size: .85rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img class="logo" src="https://i.imgur.com/F2lJzxz.png" />
          <h1 class="title">Olá, ${user.name}!</h1>
          <p class="text">
            Utilize o código <span class="token">${forgotToken}</span> para conseguir redefinir sua senha.<br />
            Caso não tenha solicitado recuperação, favor ignorar o e-mail.<br />
            <br />
            <span class="expiration">* Esse código expirará em 1 dia</span>
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
      subject: 'Recuperação de senha',
      body: emailBody,
    });
  }
}

export default ForgotPasswordService;
