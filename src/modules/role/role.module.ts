import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/role.schema';
import { LoggerModule } from '../core/logger/logger.module';
@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports: [
    LoggerModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema,
      },
    ]),
  ],
})
export class RoleModule {}
