import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Roles, RoleSchema } from './shemas/roles.shema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Roles.name,
        schema: RoleSchema,
      },
    ]),
  ],
  providers: [RolesService, RolesModule],
  controllers: [RolesController],
})
export class RolesModule {}
