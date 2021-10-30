import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create.user.dto';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '../users/schemas/user.schema';
import { IAuth } from './interfaces';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../core/mail/mail.service';
import { TokensService } from '../tokens/tokens.service';
import { dumpUser } from '../users/dump';
@Injectable()
export class AuthService {
  // registration
  private readonly EXIST_EMAIL_ERROR = 'Such email already exist';
  private readonly SALT = 5;

  // validateUser
  private readonly WRONG_AUTH = 'Wrong email or password';
  constructor(
    private userService: UsersService,
    private mailService: MailService,
    private tokensService: TokensService,
  ) {}

  // async login(userDto: CreateUserDto): Promise<IAuth> {
  //   const user = await this.validateUser(userDto);
  //   return this.tokensService.generateTokens(user);
  // }

  async registration(userDto: CreateUserDto): Promise<IAuth> {
    const canditate = await this.userService.getUserByEmailAuth(userDto.email);
    if (canditate) {
      throw new HttpException(this.EXIST_EMAIL_ERROR, HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(userDto.password, this.SALT);

    const activationLink = uuidv4();
    await this.userService.createUser({ ...userDto, password: hashPassword, activationLink });
    const user = await this.userService.getUserByEmailAuth(userDto.email);
    await this.mailService.sendActivationMail(userDto.email, `${process.env.API_URL}/api/activate/${activationLink}`);
    const tokens = await this.tokensService.generateTokens(user);
    await this.tokensService.saveToken(user._id, tokens.refreshToken);
    return {
      token: tokens,
      user: dumpUser(user),
    };
  }

  async validateUser(userDto: CreateUserDto): Promise<UserDocument> {
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
