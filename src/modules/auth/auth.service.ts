import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/modules/users/dto/create.user.dto';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '../users/schemas/user.schema';
import { dumpUser } from '../users/dump';
import { IAuth } from './interfaces';

@Injectable()
export class AuthService {
  // registration
  private readonly EXIST_EMAIL_ERROR = 'Such email already exist';
  private readonly SALT = 5;

  // validateUser
  private readonly WRONG_AUTH = 'Wrong email or password';
  constructor(private userService: UsersService, private jwtService: JwtService) {}

  async login(userDto: CreateUserDto): Promise<IAuth> {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto): Promise<IAuth> {
    const canditate = await this.userService.getUserByEmailAuth(userDto.email);
    if (canditate) {
      throw new HttpException(this.EXIST_EMAIL_ERROR, HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(userDto.password, this.SALT);
    //await this.userService.getUserByEmailAuth(userDto.email);
    await this.userService.createUser({ ...userDto, password: hashPassword });
    const user = await this.userService.getUserByEmailAuth(userDto.email);

    return this.generateToken(user);
  }

  private async generateToken(user: UserDocument): Promise<IAuth> {
    const payload = dumpUser(user);

    return {
      token: this.jwtService.sign(payload),
      user: payload,
    };
  }

  private async validateUser(userDto: CreateUserDto): Promise<UserDocument> {
    const user = await this.userService.getUserByEmailAuth(userDto.email);
    if (!user) {
      throw new HttpException(this.WRONG_AUTH, HttpStatus.UNAUTHORIZED);
    }
    const passwordEquals = await bcrypt.compare(userDto.password, user.password);
    if (!passwordEquals) {
      throw new HttpException(this.WRONG_AUTH, HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
