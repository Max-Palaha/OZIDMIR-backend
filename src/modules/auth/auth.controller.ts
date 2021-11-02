import { Body, Controller, Get, Param, Post, Put, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/users/dto';
import { AuthService } from './auth.service';
import { AuthDto, ParamActivationLinkDto } from './dto';
import { MailService } from '../core/mail/mail.service';
import { Response, Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private mailService: MailService) {}
  private readonly MaxAge = 30 * 24 * 60 * 60 * 1000;

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: AuthDto })
  @Post('/login')
  async login(@Body() userDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    try {
      const userData = await this.authService.login(userDto);
      res.cookie('refreshToken', userData.token.refreshToken, {
        maxAge: this.MaxAge,
        httpOnly: true,
      });
      return userData;
    } catch (e) {
      console.log(e);
    }
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 200, type: AuthDto })
  @Post('/registration')
  async registration(@Body() userDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    try {
      const userData = await this.authService.registration(userDto);
      res.cookie('refreshToken', userData.token.refreshToken, {
        maxAge: this.MaxAge,
        httpOnly: true,
      });
      return userData;
    } catch (e) {
      console.log(e);
    }
  }

  @ApiOperation({ summary: 'User activate' })
  @ApiResponse({ status: 200, type: AuthDto })
  @Get('/activate/:activationLink')
  async activate(@Res({ passthrough: true }) res: Response, @Param() params: ParamActivationLinkDto) {
    try {
      const activationLink = params.activationLink;
      await this.authService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      console.log(e);
    }
  }

  @Get('/refresh')
  async refresh(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await this.authService.refresh(refreshToken);
      console.log(userData);
      res.cookie('refreshToken', userData.token.refreshToken, {
        maxAge: this.MaxAge,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      console.log(e);
    }
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, type: AuthDto })
  @Post('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      const { refreshToken } = req.cookies;
      const token = await this.authService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
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
