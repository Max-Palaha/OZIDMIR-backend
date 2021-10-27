import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUser, IUserEmail } from '../../users/interfaces';
import { ISendMail } from './interfaces';

@Injectable()
export class MailService {
  // sendUserResetPassword
  private readonly RESET_PASSWORD_SUBJECT = 'Reset your OZIMIDR password';
  private readonly RESET_PASSWORD_PATH = './templates/resetPassword';
  private readonly DEFAULT_USER = 'OZIMIDR user';

  constructor(private mailerService: MailerService) {}

  async sendUserResetPassword(user: IUser, code: string): Promise<void> {
    const url = `${process.env.APP_PATH}/auth/confirm?code=${code}`;
    const context: IUserEmail = {
      url,
      firstName: user.firstName || this.DEFAULT_USER,
      lastName: user.lastName || '',
    };

    await this.send({
      to: user.email,
      subject: this.RESET_PASSWORD_SUBJECT,
      template: this.RESET_PASSWORD_PATH,
      context,
    });
  }

  private async send({ context, template, to, subject }: ISendMail): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        from: process.env.DEFAULT_APP_EMAIL,
        subject,
        template,
        context,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendUserConfirmation() {
    //const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: 'example@gmail.com',
      from: 'example@gmail.com', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './templates/passMail', // .hbs extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        //name: user.name,
        //url,
      },
    });
  }

  async sendActivationMail(to,link){

  }
}
