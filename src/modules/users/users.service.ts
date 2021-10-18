import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { dumpUser } from './dump';
import { IUser } from './interfaces';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly NOT_EXIST = 'User not found';
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<boolean> {
    try {
      const user = await this.userModel.create(createUserDto);

      await user.save();

      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUsers(): Promise<IUser[]> {
    const users = await this.userModel.find().lean();

    return users.map(dumpUser);
  }

  async getUserByEmailAuth(email: string) {
    const user = await this.userModel.findOne({ email }).lean();

    return user;
  }
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userModel.findOne({
        id: id,
      });
      if (!user) {
        throw new HttpException(this.NOT_EXIST, HttpStatus.NOT_FOUND);
      }
      const updatedUser = await user.updateOne({ ...updateUserDto });
      return updatedUser;
    } catch (err) {
      Logger.error(err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
