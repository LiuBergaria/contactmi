import nodemailer from 'nodemailer';

interface Request {
  to: {
    name: string;
    email: string;
  };
  subject: string;
  body: string;
}

class SendEmailService {
  public async run({ to, subject, body }: Request): Promise<void> {
    const account = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    const message = await transporter.sendMail({
      from: {
        name: 'Equipe ContactMi',
        address: 'suporte@contactmi.com',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: body,
    });

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export default SendEmailService;
