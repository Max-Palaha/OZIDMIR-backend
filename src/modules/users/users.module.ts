import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
<<<<<<< HEAD
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from './models/user.schema';
=======
import { User, UserSchema } from './schemas/user.schema';
>>>>>>> 60d6727026fcf7ae8481e180aa8a1e08b74c1ddc
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef( () => AuthModule)
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
