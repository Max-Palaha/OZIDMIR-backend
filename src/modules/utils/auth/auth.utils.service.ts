import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create.user.dto';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '../../users/schemas/user.schema';
import { IToken } from '../../auth/interfaces';
import { dumpUser } from '../../users/dump';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthServiceUtils {

  // validateUser
  private readonly WRONG_AUTH = 'Wrong email or password';

  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async generateTokens(user: UserDocument): Promise<IToken> {
    const payload = dumpUser(user);
    const accessToken = this.jwtService.sign(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '30s' });
    const refreshToken = this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' });
    return {
      accessToken,
      refreshToken,
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
