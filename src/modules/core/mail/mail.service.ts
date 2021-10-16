import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IUser, IUserEmail } from '../../users/interfaces';
import { ISendMail } from './interfaces';

@Injectable()
export class MailService {
  // sendUserResetPassword
  private readonly RESET_PASSWORD_SUBJECT = 'Reset your OZIMIDR password';
  private readonly RESET_PASSWORD_PATH = './templates/passMail';

  constructor(private mailerService: MailerService) {}

  async sendUserResetPassword(user: IUser, code: string) {
    const url = `${process.env.APP_PATH}/auth/confirm?code=${code}`;
    const context: IUserEmail = {
      url,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
    };

    await this.send({
      to: user.email,
      subject: this.RESET_PASSWORD_SUBJECT,
      template: this.RESET_PASSWORD_PATH,
      context,
    });
  }

  private async send({ context, template, to, subject }: ISendMail) {
    await this.mailerService.sendMail({
      to,
      from: process.env.DEFAULT_APP_EMAIL,
      subject,
      template,
      context,
    });
  }
}
