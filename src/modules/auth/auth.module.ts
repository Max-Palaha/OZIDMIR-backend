import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/modules/users/users.module';
import { RoleModule } from '../role/role.module';
import { MailModule } from '../core/mail/mail.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TokensModule,
    forwardRef(() => UsersModule),
    RoleModule,
    UsersModule,
    MailModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '60s',
      },
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
