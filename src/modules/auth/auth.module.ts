import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { RoleModule } from '../role/role.module';
import { MailModule } from '@core/mail/mail.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokensModule } from '../tokens/tokens.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AuthUtilsModule } from '../utils/auth/auth.utils.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    AuthUtilsModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    TokensModule,
    UsersModule,
    RoleModule,
    MailModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
