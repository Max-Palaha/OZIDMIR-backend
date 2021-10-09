/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { User, UserDocument } from './models/user.schema';

@Injectable()
export class UsersService {
  private readonly NOT_EXIST = 'User not found';
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userModel.create(createUserDto);
    return user.save();
  }
  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userModel.findOne({
        _id: id,
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
