import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RoleDocument, Role } from './schemas/role.schema';
import { CreateRoleDto } from './dto';
import { Model } from 'mongoose';
import { dumpRole } from './dump';
import { IRole } from './interfaces';
import { Logger } from '../core/logger/helpers/logger.decorator';
import { LoggerService } from '../core/logger/logger.service';

@Injectable()
export class RoleService {
  constructor(
    @Logger('RoleService') private logger: LoggerService,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {
    this.logger.log('role');
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<boolean> {
    try {
      const role = await this.roleModel.create(createRoleDto);
      await role.save();

      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getRoles(): Promise<IRole[]> {
    const roles = await this.roleModel.find().lean();
    return roles.map(dumpRole);
  }
}
