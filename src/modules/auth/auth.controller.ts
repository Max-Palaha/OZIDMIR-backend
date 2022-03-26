import { Body, Controller, Get, Param, Post, Put, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { CreateUserDto } from '@users/dto';
import { MailService } from '@core/mail/mail.service';
import { Cookieable } from '@libs/cookie/decorators/cookieable';
import { REFRESH_TOKEN } from '@libs/cookie/constants/cookie.fields.constants';
import { CookieEvict } from '@libs/cookie/decorators/cookieEvict';
import { cookieSymbol } from '@common/constants/metadata.symbols.constants';
import { MetadataResponse } from '@common/decorators/metadata.response';
import { AuthDto, ParamActivationLinkDto } from './dto';
import { AuthService } from './auth.service';
import { IAuth } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private mailService: MailService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: AuthDto })
  @Post('/login')
  @Cookieable(REFRESH_TOKEN)
  async login(
    @Body() userDto: CreateUserDto,
    @MetadataResponse([cookieSymbol]) @Res({ passthrough: true }) _res: Response,
  ): Promise<IAuth> {
    return this.authService.login(userDto);
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 200, type: AuthDto })
  @Post('/registration')
  @Cookieable(REFRESH_TOKEN)
  async registration(
    @Body() userDto: CreateUserDto,
    @MetadataResponse([cookieSymbol]) @Res({ passthrough: true }) _res: Response,
  ): Promise<IAuth> {
    return this.authService.registration(userDto);
  }

  @ApiOperation({ summary: 'User activate' })
  @ApiResponse({ status: 200 })
  @Get('/activate/:activationLink')
  async activate(@Param() params: ParamActivationLinkDto): Promise<void> {
    const activationLink: string = params.activationLink;
    return this.authService.activate(activationLink);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @Get('/refresh')
  @ApiResponse({ status: 200, type: AuthDto })
  async refresh(
    @MetadataResponse([cookieSymbol]) @Res({ passthrough: true }) _res: Response,
    @Req() req: Request,
  ): Promise<IAuth> {
    const { refreshToken } = req.cookies;
    return this.authService.refresh(refreshToken);
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, type: AuthDto })
  @Post('/logout')
  @CookieEvict(REFRESH_TOKEN)
  async logout(
    @Req() req: Request,
    @MetadataResponse([cookieSymbol]) @Res({ passthrough: true }) _res: Response,
  ): Promise<boolean> {
    const { refreshToken } = req.cookies;
    return this.authService.logout(refreshToken);
  }

  @ApiOperation({ summary: 'User resetPass' })
  @ApiResponse({ status: 200, type: AuthDto })
  @Put('/reset/password')
  async resetPassword(): Promise<void> {
    return this.mailService.sendUserConfirmation();
  }
}
