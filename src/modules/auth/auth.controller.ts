import { Body, Controller, Post, Put, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/users/dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { MailService } from '../core/mail/mail.service';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private mailService: MailService) {}

  // @ApiOperation({ summary: 'User login' })
  // @ApiResponse({ status: 200, type: AuthDto })
  // @Post('/login')
  // login(@Body() userDto: CreateUserDto) {
  //   return this.authService.login(userDto);
  // }

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 200, type: AuthDto })
  @Post('/registration')
  async registration(@Body() userDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
    try {
      const userData = await this.authService.registration(userDto);
      response.cookie('refreshToken', userData.token.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return userData;
    } catch (e) {
      console.log(e);
    }
  }

  @ApiOperation({ summary: 'User resetPass' })
  @ApiResponse({ status: 200, type: AuthDto })
  @Put('/resetPass')
  resetPass() {
    return this.mailService.sendUserConfirmation();
  }
}
