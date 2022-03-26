import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '@users/users.module';
import { RoleModule } from '../role/role.module';
import { MailModule } from '@core/mail/mail.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokensModule } from '../tokens/tokens.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@users/schemas/user.schema';
import { AuthUtilsService } from './utils/auth.utils.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthUtilsService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    TokensModule,
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
    }),
    RoleModule,
    MailModule,
  ],
  exports: [AuthService, JwtModule, AuthUtilsService],
})
export class AuthModule {}
