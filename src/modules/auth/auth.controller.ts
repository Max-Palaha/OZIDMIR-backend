import { Body, Controller, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/users/dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { MailService } from '../core/mail/mail.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private mailService: MailService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: AuthDto })
  @Post('/login')
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 200, type: AuthDto })
  @Post('/registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }

  @ApiOperation({ summary: 'User resetPass' })
  @ApiResponse({ status: 200, type: AuthDto })
  @Put('/resetPass')
  resetPass() {
    return this.mailService.sendUserConfirmation();
  }
}
