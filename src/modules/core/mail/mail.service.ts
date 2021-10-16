import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IUserEmail } from '../../users/interfaces';

@Injectable()
export class MailService {
  static sendMail: any;
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation() {
    //const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: 'example@gmail.com',
      from: 'example@gmail.com', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './templates/passMail', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        //name: user.name,
        //url,
      },
    });
  }
}
