import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from '../role/role.module';
import { AuthUtilsModule } from '../utils/auth/auth.utils.module';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    forwardRef(() => AuthUtilsModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RoleModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
