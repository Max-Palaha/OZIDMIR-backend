import * as bcrypt from 'bcryptjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '@users/schemas/user.schema';
import { UsersService } from '@users/users.service';
import { CreateUserDto } from '@users/dto';
import { IUser } from '@users/interfaces';
import { dumpUser } from '@users/dump';
import { IToken } from '@auth/interfaces';

@Injectable()
export class AuthUtilsService {
  // validateUser
  private readonly WRONG_AUTH: string = 'Wrong email or password';

  constructor(private jwtService: JwtService, private userService: UsersService) {}

  async generateTokens(user: UserDocument): Promise<IToken> {
    const payload: IUser = dumpUser(user);
    const accessToken: string = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '30m',
    });
    const refreshToken: string = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(userDto: CreateUserDto): Promise<void> {
    const password: string = await this.userService.getUserPassword(userDto.email);
    const passwordEquals: boolean = await bcrypt.compare(userDto.password, password);
    if (!passwordEquals) {
      throw new HttpException(this.WRONG_AUTH, HttpStatus.UNAUTHORIZED);
    }
  }

  validateAccessToken(token: string): IUser {
    return this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET });
  }

  validateRefreshToken(token: string): IUser {
    return this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET });
  }
}
