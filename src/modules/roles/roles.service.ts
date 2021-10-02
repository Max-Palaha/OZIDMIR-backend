import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RoleDocument, Roles } from './shemas/roles.shema';
import { CreateRoleDto } from './roles.dto';
import { Model } from 'mongoose';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Roles.name) private roleModel: Model<RoleDocument>) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Roles> {
    const role = await this.roleModel.create(createRoleDto);
    return role.save();
  }
  async getAllRoles(): Promise<Roles[]> {
    return this.roleModel.find().exec();
  }
}
