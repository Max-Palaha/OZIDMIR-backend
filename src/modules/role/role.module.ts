import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/role.schema';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema,
      },
    ]),
  ],
})
export class RoleModule {}
