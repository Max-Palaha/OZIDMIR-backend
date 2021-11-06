import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthServiceUtils } from './auth.utils.service';
import { JwtAuthGuard } from './helpers/jwt-auth.guard';
import { RolesGuard } from './helpers/roles.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
        secret: process.env.PRIVATE_KEY || 'SECRET',
        signOptions: {
          expiresIn: '30d',
        },
      }),
  ],
  providers: [AuthServiceUtils, JwtAuthGuard, RolesGuard],
  exports: [AuthServiceUtils, JwtModule, JwtAuthGuard, RolesGuard],
})
export class AuthUtilsModule {}
