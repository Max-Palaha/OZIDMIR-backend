import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create.user.dto';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/schemas/user.schema';
import { IAuth } from './interfaces';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../core/mail/mail.service';
import { TokensService } from '../tokens/tokens.service';
import { dumpUser } from '../users/dump';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class AuthService {
  // registration
  private readonly EXIST_EMAIL_ERROR = 'Such email already exist';
  private readonly SALT = 5;

  // validateUser
  private readonly WRONG_AUTH = 'Wrong email or password';
  private readonly WRONG_REFRESH = 'Wrong REFRESH';

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userService: UsersService,
    private mailService: MailService,
    private tokensService: TokensService,
  ) {}

  // async login(userDto: CreateUserDto): Promise<IAuth> {
  //   const user = await this.validateUser(userDto);
  //   return this.tokensService.generateTokens(user);
  // }

  async login(userDto: CreateUserDto): Promise<IAuth> {
    console.log(userDto);
    const user = await this.validateUser(userDto);
    const tokens = await this.tokensService.generateTokens(user);
    await this.tokensService.saveToken(user._id, tokens.refreshToken);
    return {
      token: tokens,
      user: dumpUser(user),
    };
  }

  async registration(userDto: CreateUserDto): Promise<IAuth> {
    const canditate = await this.userService.getUserByEmailAuth(userDto.email);
    if (canditate) {
      throw new HttpException(this.EXIST_EMAIL_ERROR, HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(userDto.password, this.SALT);

    const activationLink = uuidv4();
    await this.userService.createUser({ ...userDto, password: hashPassword, activationLink });
    const user = await this.userService.getUserByEmailAuth(userDto.email);
    await this.mailService.sendActivationMail(userDto.email, `${process.env.API_URL}/auth/activate/${activationLink}`);
    const tokens = await this.tokensService.generateTokens(user);
    await this.tokensService.saveToken(user._id, tokens.refreshToken);
    return {
      token: tokens,
      user: dumpUser(user),
    };
  }

  async activate(activationLink: string): Promise<void> {
    const user = await this.userService.getUserByActivationLink(activationLink);
    if (!user) {
      throw new HttpException(this.WRONG_AUTH, HttpStatus.UNAUTHORIZED);
    }
    user.isActivated = true;
    await user.save();
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new HttpException(this.WRONG_REFRESH, HttpStatus.UNAUTHORIZED);
    }

    const userData = this.tokensService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokensService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw new HttpException(this.WRONG_REFRESH, HttpStatus.UNAUTHORIZED);
    }

    const userDto = await this.userService.getUserByEmailAuth(userData.email);

    const tokens = await this.tokensService.generateTokens(userDto);
    await this.tokensService.saveToken(userDto._id, tokens.refreshToken);
    return {
      token: tokens,
      user: dumpUser(userDto),
    };
  }

  async logout(refreshToken) {
    const token = await this.tokensService.removeToken(refreshToken);
    return token;
  }

  async validateUser(userDto: CreateUserDto): Promise<UserDocument> {
    console.log(userDto);
    const user = await this.userService.getUserByEmailAuth(userDto.email);
    if (!user) {
      console.log('1');
      throw new HttpException(this.WRONG_AUTH, HttpStatus.UNAUTHORIZED);
    }
    console.log(userDto.password);
    console.log(user.password);
    const passwordEquals = await bcrypt.compare(userDto.password, user.password);
    console.log(passwordEquals);
    if (!passwordEquals) {
      throw new HttpException(this.WRONG_AUTH, HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
