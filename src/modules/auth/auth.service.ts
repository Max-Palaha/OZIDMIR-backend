import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create.user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../core/mail/mail.service';
import { TokensService } from '../tokens/tokens.service';
import { dumpUser } from '../users/dump';
import { AuthServiceUtils } from '../utils/auth/auth.utils.service';
import { IAuth } from './interfaces';



@Injectable()
export class AuthService {
  // registration
  private readonly EXIST_EMAIL_ERROR = 'Such email already exist';
  private readonly SALT = 5;

  // validateUser
  private readonly WRONG_AUTH = 'Wrong email or password';

  // refresh token
  private readonly WRONG_REFRESH = 'Wrong REFRESH';

  constructor(
    private userService: UsersService,
    private mailService: MailService,
    private tokensService: TokensService,
    private authServiceUtils: AuthServiceUtils,
  ) {}

  async login(userDto: CreateUserDto): Promise<IAuth> {
    try {
      await this.authServiceUtils.validateUser(userDto);
      const user = await this.userService.getUserByEmail(userDto.email);
      const tokens = await this.authServiceUtils.generateTokens(user);
      await this.tokensService.saveToken(user._id, tokens.refreshToken);
      return {
        token: tokens,
        user: dumpUser(user),
      };
    } catch (e) {
      throw new HttpException(this.WRONG_AUTH, HttpStatus.UNAUTHORIZED);
    }
  }

  async registration(userDto: CreateUserDto): Promise<IAuth> {
    try {
      const isExistUser = await this.userService.checkExistUserByEmail(userDto.email);
      if (isExistUser) {
        throw new HttpException(this.EXIST_EMAIL_ERROR, HttpStatus.BAD_REQUEST);
      }
      const hashPassword = await bcrypt.hash(userDto.password, this.SALT);

      const activationLink = uuidv4();
      await this.userService.createUser({ ...userDto, password: hashPassword, activationLink });
      const user = await this.userService.getUserByEmail(userDto.email);
      await this.mailService.sendActivationMail(
        userDto.email,
        `${process.env.API_URL}/auth/activate/${activationLink}`,
      );
      const tokens = await this.authServiceUtils.generateTokens(user);
      await this.tokensService.saveToken(user._id, tokens.refreshToken);
      return {
        token: tokens,
        user: dumpUser(user),
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async activate(activationLink: string): Promise<void> {
    await this.userService.updateUser({ activationLink }, { isActivated: true });
    console.log('function activate done');
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new HttpException(this.WRONG_REFRESH, HttpStatus.UNAUTHORIZED);
    }

    const userData = this.authServiceUtils.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokensService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw new HttpException(this.WRONG_REFRESH, HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userService.getUserByEmail(userData.email);
    const tokens = await this.authServiceUtils.generateTokens(user);
    await this.tokensService.saveToken(user._id, tokens.refreshToken);
    return {
      token: tokens,
      user: user,
    };
  }

  async logout(refreshToken) {
    const token = await this.tokensService.removeToken(refreshToken);
    return token;
  }
}
