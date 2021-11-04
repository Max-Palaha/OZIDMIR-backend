import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { dumpUser } from './dump';
import { IUser, IUserCreate } from './interfaces';
import { User, UserDocument } from './schemas/user.schema';
import { RoleService } from '../role/role.service';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private roleService: RoleService) {}

  async createUser(createUserDto: IUserCreate): Promise<boolean> {
    try {
      const role = await this.roleService.getRoleByName('USER');
      const user = await this.userModel.create({
        ...createUserDto,
        roles: [role.id],
      });

      await user.save();

      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUsers(): Promise<IUser[]> {
    const users = await this.userModel.find().populate('roles').lean();

    return users.map(dumpUser);
  }

  async getUserByEmailAuth(email: string) {
    const user = await this.userModel.findOne({ email }).populate('roles').lean();

    return user;
  }

  async getUserByActivationLink(activationLink: string) {
    const user = await this.userModel.findOne({ activationLink });

    return user;
  }
}
