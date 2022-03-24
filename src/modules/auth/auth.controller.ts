import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto';
import { AuthService } from './auth.service';
import { AuthDto, ParamActivationLinkDto } from './dto';
import { MailService } from '@core/mail/mail.service';
import { Response, Request } from 'express';
import { IAuth } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private mailService: MailService) {}
  // tokens lifetime
  private readonly MONTH_IN_SECONDS: number = 30 * 24 * 60 * 60 * 1000;

  // something
  private readonly WRONG_SOMETHING: string = 'Something wrong';

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: AuthDto })
  @Post('/login')
  async login(@Body() userDto: CreateUserDto, @Res({ passthrough: true }) res: Response): Promise<IAuth> {
    try {
      const userData: IAuth = await this.authService.login(userDto);
      res.cookie('refreshToken', userData.tokens.refreshToken, {
        maxAge: this.MONTH_IN_SECONDS,
        httpOnly: true,
      });
      return userData;
    } catch (error: unknown) {
      throw new HttpException(error || this.WRONG_SOMETHING, HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 200, type: AuthDto })
  @Post('/registration')
  async registration(@Body() userDto: CreateUserDto, @Res({ passthrough: true }) res: Response): Promise<IAuth> {
    try {
      const userData: IAuth = await this.authService.registration(userDto);
      res.cookie('refreshToken', userData.tokens.refreshToken, {
        maxAge: this.MONTH_IN_SECONDS,
        httpOnly: true,
      });
      return userData;
    } catch (error: unknown) {
      throw new HttpException(error || this.WRONG_SOMETHING, HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiOperation({ summary: 'User activate' })
  @ApiResponse({ status: 200, type: AuthDto })
  @Get('/activate/:activationLink')
  async activate(@Param() params: ParamActivationLinkDto): Promise<void> {
    try {
      const activationLink: string = params.activationLink;
      await this.authService.activate(activationLink);
    } catch (error: unknown) {
      throw new HttpException(error || this.WRONG_SOMETHING, HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('/refresh')
  async refresh(@Res({ passthrough: true }) res: Response, @Req() req: Request): Promise<IAuth> {
    try {
      const { refreshToken } = req.cookies;
      const userData: IAuth = await this.authService.refresh(refreshToken);
      res.cookie('refreshToken', userData.tokens.refreshToken, {
        maxAge: this.MONTH_IN_SECONDS,
        httpOnly: true,
      });
      return userData;
    } catch (error: unknown) {
      throw new HttpException(error || this.WRONG_SOMETHING, HttpStatus.BAD_REQUEST);
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
      return token;
    } catch (error: unknown) {
      throw new HttpException(error || this.WRONG_SOMETHING, HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiOperation({ summary: 'User resetPass' })
  @ApiResponse({ status: 200, type: AuthDto })
  @Put('/reset/password')
  resetPass(): Promise<void> {
    return this.mailService.sendUserConfirmation();
  }
}
