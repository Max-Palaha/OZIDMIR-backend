import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create.user.dto';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcryptjs';
import { IAuth, IToken } from './interfaces';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../core/mail/mail.service';
import { TokensService } from '../tokens/tokens.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../users/interfaces';
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
    private jwtService: JwtService,
    private userService: UsersService,
    private mailService: MailService,
    private tokensService: TokensService,
  ) {}

  async login(userDto: CreateUserDto): Promise<IAuth> {
    try {
      await this.validateUser(userDto);
      const user = await this.userService.getUserByEmail(userDto.email);
      const tokens = await this.generateTokens(user);
      await this.tokensService.saveToken(user.id, tokens.refreshToken);
      return {
        token: tokens,
        user: user,
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
      const user = await this.userService.createUser({ ...userDto, password: hashPassword, activationLink });
      await this.mailService.sendActivationMail(
        userDto.email,
        `${process.env.API_URL}/auth/activate/${activationLink}`,
      );
      const tokens = await this.generateTokens(user);
      await this.tokensService.saveToken(user.id, tokens.refreshToken);
      return {
        token: tokens,
        user: user,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async activate(activationLink: string): Promise<void> {
    await this.userService.updateUser({ activationLink }, { isActivated: true });
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new HttpException(this.WRONG_REFRESH, HttpStatus.UNAUTHORIZED);
    }

    const userData = this.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokensService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw new HttpException(this.WRONG_REFRESH, HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userService.getUserByEmail(userData.email);
    const tokens = await this.generateTokens(user);
    await this.tokensService.saveToken(user.id, tokens.refreshToken);
    return {
      token: tokens,
      user: user,
    };
  }

  async logout(refreshToken) {
    const token = await this.tokensService.removeToken(refreshToken);
    return token;
  }

  async generateTokens(user: IUser): Promise<IToken> {
    const accessToken = this.jwtService.sign(user, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '30m' });
    const refreshToken = this.jwtService.sign(user, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' });
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(userDto: CreateUserDto): Promise<void> {
    const password = await this.userService.getUserPassword(userDto.email);
    const passwordEquals = await bcrypt.compare(userDto.password, password);
    if (!passwordEquals) {
      throw new HttpException(this.WRONG_AUTH, HttpStatus.UNAUTHORIZED);
    }
  }

  validateAccessToken(token: string) {
    try {
      const userData = this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET });
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET });
      return userData;
    } catch (e) {
      return null;
    }
  }
}
