import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { dumpUser } from './dump';
import { IUser, IUserCreate, IUserSearch, IUserUpdatedFields } from './interfaces';
import { User, UserDocument } from './schemas/user.schema';
import { RoleService } from '../role/role.service';
import { S3Service } from '@core/s3/s3.service';
import { IRole } from '../role/interfaces';

@Injectable()
export class UsersService {
  private readonly USER_NOT_EXIST: string = 'User not exist';
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private roleService: RoleService,
    private s3Service: S3Service,
  ) {}

  async createUser(createUserDto: IUserCreate): Promise<IUser> {
    try {
      const role: IRole = await this.roleService.getRoleByName('USER');
      const user = await this.userModel.create({
        ...createUserDto,
        roles: [role.id],
      });

      await user.save();

      return dumpUser(await this.getUserByEmail(createUserDto.email));
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUsers(): Promise<IUser[]> {
    const users: UserDocument[] = await this.userModel.find().populate('roles').lean();

    return users.map(dumpUser);
  }

  async getUserPassword(email: string): Promise<string> {
    const user: UserDocument = await this.userModel.findOne({ email }).select('password').lean();

    return user.password;
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    const user: UserDocument = await this.userModel.findOne({ email }).populate('roles').lean();

    if (!user) {
      throw new HttpException(this.USER_NOT_EXIST, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async checkExistUserByEmail(email: string): Promise<boolean> {
    const user: UserDocument = await this.userModel.findOne({ email }).select('email').lean();

    if (!user) {
      return false;
    }

    return true;
  }

  async getUserByActivationLink(activationLink: string): Promise<IUser> {
    const user: UserDocument = await this.userModel.findOne({ activationLink });

    return dumpUser(user);
  }

  async updateUser(fieldsBySearch: IUserSearch, updatedFileds: IUserUpdatedFields): Promise<void> {
    try {
      await this.userModel.updateOne(fieldsBySearch, updatedFileds);
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadPhoto(file: Express.Multer.File, user: IUser): Promise<void> {
    const { id } = user;
    const avatar: string = await this.s3Service.uploadImage(file.buffer, 'profile', id);
    await this.updateUser({ _id: id }, { avatar });
  }
}
