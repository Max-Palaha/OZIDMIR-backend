import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../../users/users.module';
import { AuthServiceUtils } from './auth.utils.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],
  providers: [AuthServiceUtils],
  exports: [AuthServiceUtils, JwtModule],
})
export class AuthUtilsModule {}
